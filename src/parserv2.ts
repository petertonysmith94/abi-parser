import { readFileSync } from "fs";
import { join } from "path";
import { ConcreteTypeV1, JsonAbiV1, MetadataTypeV1, TypeArgumentV1 } from "./types";

interface AggregateType {
  concreteType: string | undefined; // e.g. struct GenericNestedLevelOne<u8>
  concreteTypeId: string | undefined; // e.g. 0x1234

  metadataType: string | undefined; // e.g. struct GenericNestedLevelOne
  metadataTypeId: number | undefined; // e.g. 0x1234

  typeParameters?: readonly number[];
  typeArguments?: AggregateType[];
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

  public *iterator(inputs: readonly (number | string)[] = []): IterableIterator<AggregateType> {
    let element;
    const stack = [...inputs];

    while (element = stack.pop()) {
      if (!element) {
        return;
      }

      const isConcreteType = typeof element === 'string';
      const concreteType = isConcreteType ? this.concreteTypes.get(element) : undefined;

      const metadataTypeId = isConcreteType ? concreteType?.metadataTypeId : element;
      const metadataType = metadataTypeId ? this.metadataTypes.get(metadataTypeId) : undefined;

      yield {
        concreteType: concreteType?.type,
        concreteTypeId: concreteType?.concreteTypeId,

        metadataType: metadataType?.type,
        metadataTypeId: metadataTypeId,

        typeParameters: metadataType?.typeParameters ?? undefined,
        typeArguments: concreteType?.typeArguments ? Array.from(
          this.iterator(concreteType.typeArguments)
        ) : undefined
      }
    }
  }
}


const baseDir = process.cwd();
const abiPath = 'sway/contract-deep-generics/out/release/contract-deep-generics-abi.json'
const abiRaw = readFileSync(join(baseDir, abiPath), 'utf8')
const abi: JsonAbiV1 = JSON.parse(abiRaw)

const stack: (string | number)[] = []
abi.functions.forEach((func) => {
  func.inputs.forEach((param) => stack.push(param.concreteTypeId))
  stack.push(func.output)
})
abi.loggedTypes.forEach((log) => stack.push(log.concreteTypeId))
abi.messagesTypes.forEach((msg) => stack.push(msg.concreteTypeId))
abi.configurables.forEach((config) => stack.push(config.concreteTypeId))

const parser = new Parser(abi);
const types = Array.from(parser.iterator(stack))
console.log(JSON.stringify(types, null, 2))