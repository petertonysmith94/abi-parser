import { readFileSync, ReadPosition } from "fs";
import { join } from "path";
import { AbiFunctionInputV1, ComponentV1, ConcreteTypeV1, JsonAbiV1, MetadataTypeV1, TypeArgumentV1 } from "./types";

interface ComponentArgument {
  typeParameter: number;
  typeArgument: string | TypeArgumentV1;
}

interface AggregateType {
  name?: string;

  // concreteType: string | undefined; // e.g. struct GenericNestedLevelOne<u8>
  // concreteTypeId: string | undefined; // e.g. 0x1234

  // metadataType: string | undefined; // e.g. struct GenericNestedLevelOne
  // metadataTypeId: number | undefined; // e.g. 0x1234

  componentArguments?: Record<number, string | TypeArgumentV1>;
  components?: AggregateType[];
}


export class Parser {
  private concreteTypes: Map<string, ConcreteTypeV1> = new Map();
  private metadataTypes: Map<number, MetadataTypeV1> = new Map();

  constructor(abi: JsonAbiV1) {
    abi.concreteTypes.forEach((concreteType) => {
      this.concreteTypes.set(concreteType.concreteTypeId, concreteType)
    })
    abi.metadataTypes.forEach((metadataType) => {
      this.metadataTypes.set(metadataType.metadataTypeId, metadataType)
    })
  }

  private getByTypeId(typeId: number | string, parentTypeArguments: Record<number, string | TypeArgumentV1> = {}): { concreteType?: ConcreteTypeV1, metadataType?: MetadataTypeV1 } {
    const parentTypeArgument = Object.keys(parentTypeArguments).find((key) => key === typeId.toString());
    if (parentTypeArgument) {
      const maybeConcreteId = parentTypeArguments[parentTypeArgument];

      if (typeof maybeConcreteId === 'string') {
        return this.getByTypeId(maybeConcreteId as string);
      }

      if (typeof maybeConcreteId === 'object') {
        return this.getByTypeId(maybeConcreteId.typeId);
      }
    }
    
    const isConcreteType = typeof typeId === 'string';
    const concreteType = isConcreteType ? this.concreteTypes.get(typeId) : undefined;

    const metadataTypeId = isConcreteType ? concreteType?.metadataTypeId : typeId;
    const metadataType = metadataTypeId ? this.metadataTypes.get(metadataTypeId) : undefined;

    return { concreteType, metadataType };
  }

  public *iteratorFunctionInput(
    inputs: readonly AbiFunctionInputV1[] = [],
  ): IterableIterator<AggregateType> {
    const inputIterator = this.iterator(inputs.map((input) => input.concreteTypeId));
    
    for (let i = 0; i < inputs.length; i++) {
      const { value } = inputIterator.next();
      if (value) {
        yield { ...value, name: inputs[i].name };
      }
    }
  }

  public *iterator(
    inputs: readonly (number | string | (TypeArgumentV1 | ComponentV1))[] = [],
    parentTypeArguments: Record<number, string | TypeArgumentV1> = {}
  ): IterableIterator<AggregateType> {
    let element;
    const stack = [...inputs];

    while (element = stack.pop()) {
      if (!element) {
        return;
      }

      // It's a component or type argument
      if (typeof element === 'object') {
        // This could be either a ComponentV1 or a TypeArgumentV1
        const component: ComponentV1 = element;
        let { concreteType, metadataType } = this.getByTypeId(component.typeId, parentTypeArguments);
        yield this.createAggregateType(concreteType, metadataType, component.name, parentTypeArguments);
      } else {
        const typeId: string | number = element;
        let { concreteType, metadataType } = this.getByTypeId(typeId, parentTypeArguments);
        yield this.createAggregateType(concreteType, metadataType, undefined, parentTypeArguments);
      }
    }
  }

  private createAggregateType(
    concreteType?: ConcreteTypeV1,
    metadataType?: MetadataTypeV1,
    name?: string,
    parentTypeArguments: Record<number, string | TypeArgumentV1> = {}
  ): AggregateType {
    const typeParameters = metadataType?.typeParameters ?? [];
    // const typeArguments = concreteType?.typeArguments ?? parentTypeArguments ?? [];
    const typeArguments = this.createTypeArguments(
      typeParameters,
      concreteType?.typeArguments ?? [],
      parentTypeArguments
    );
    const componentArguments = this.createComponentArguments(typeParameters, typeArguments);

    return {
      name,
      type: metadataType?.type ?? concreteType?.type,
      typeId: concreteType?.concreteTypeId ?? metadataType?.metadataTypeId,
      // concreteType: concreteType?.type,
      // concreteTypeId: concreteType?.concreteTypeId,

      // metadataType: metadataType?.type,
      // metadataTypeId: metadataType?.metadataTypeId,

      // typeParameters: metadataType?.typeParameters,
      // typeArguments: concreteType?.typeArguments,
      // typeArguments,
      // componentArguments,
      // parentTypeArguments,
      components: metadataType?.components ? Array.from(
        this.iterator(metadataType.components, componentArguments)
      ) : undefined
    }
  }

  private createComponentArguments(
    typeParameters: readonly number[],
    typeArguments: readonly (string | TypeArgumentV1)[]
  ): Record<number, string | TypeArgumentV1> {
    return Object.fromEntries(
      typeParameters.map((typeParameter, index) => {
        return [typeParameter, typeArguments[index]]
      })
    )
  }

  private createTypeArguments(
    typeParameters: readonly number[],
    typeArguments: readonly string[],
    componentArguments: Record<number, string | TypeArgumentV1>
  ): readonly (string | TypeArgumentV1)[] {
    if (typeParameters.length === 0) {
      return [];
    }

    if (typeArguments.length) {
      return typeArguments;
    }

    return Object.values(componentArguments).splice(0, typeParameters.length);
  }
}


const baseDir = process.cwd();
const abiPath = 'sway/contract-deep-generics/out/release/contract-deep-generics-abi.json'
const abiRaw = readFileSync(join(baseDir, abiPath), 'utf8')
const abi: JsonAbiV1 = JSON.parse(abiRaw)

const parser = new Parser(abi);

const funcs = abi.functions.map((func) => {
  return {
    ...func,
    inputs: Array.from(parser.iteratorFunctionInput(func.inputs)),
    output: parser.iterator([func.output]).next().value
  }
})

console.log(JSON.stringify(funcs[0].inputs[0], null, 2))