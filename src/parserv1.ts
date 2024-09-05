import { readFileSync } from "fs";
import { join } from "path";
import { ConcreteTypeV1, JsonAbiV1, MetadataTypeV1, TypeArgumentV1 } from "./types";

const baseDir = process.cwd();
const abiPath = 'sway/contract-deep-generics/out/release/contract-deep-generics-abi.json'
const abiRaw = readFileSync(join(baseDir, abiPath), 'utf8')
const abi: JsonAbiV1 = JSON.parse(abiRaw)

// Collate types
const createTypeRepository = (abi: JsonAbiV1) => {
  const metadataTypes = new Map(
    abi.metadataTypes.map((metadataType) => [metadataType.metadataTypeId, metadataType])
  )
  const concreteTypes = new Map(
    abi.concreteTypes.map((concreteType) => [concreteType.concreteTypeId, concreteType])
  )

  const getConcreteTypeById = (id: string) => {
    const concreteType = concreteTypes.get(id)
    if (!concreteType) {
      // TODO: add error codes
      throw new Error(`Concrete type with ID ${id} not found`)
    }
    return concreteType
  }

  const getMetadataTypeById = (id: number) => {
    const metadataType = metadataTypes.get(id)
    if (!metadataType) {
      // TODO: add error codes
      throw new Error(`Metadata type with ID ${id} not found`)
    }
    return metadataType
  }

  const getTypeById = (typeId: string | number) => {
    const isConcreteType = typeof typeId === 'string';
    const concreteType = isConcreteType ? getConcreteTypeById(typeId) : null;
    const metadataType = !isConcreteType ? getMetadataTypeById(typeId) : null;

    return {
      concreteType,
      metadataType,
    }
  }

  return {
    getConcreteTypeById,
    getMetadataTypeById,
    getTypeById,
  }
}


type TypeIteratorReturnType = Pick<ConcreteTypeV1, 'type' | 'concreteTypeId' | 'metadataTypeId'> & {
  concreteType?: TypeIteratorReturnType;
  metadataType?: TypeIteratorReturnType;
}

// class TypeIterator {
//   public constructor (
//     private typesRepository: ReturnType<typeof createTypeRepository>
//   ) {
    
//   }

//   public *iterate(typeId: string | number, parentArguments: any = null): IterableIterator<any> {
//     const { metadataType, concreteType } = this.typesRepository.getTypeById(typeId);

//     if (concreteType) {
//       console.log('concrete', JSON.stringify({ concreteType, parentArguments }, null, 2))
//       const typeArguments = (concreteType?.typeArguments ?? []).flatMap(
//         (concreteTypeId: string) => Array.from(this.iterate(concreteTypeId))
//       )

//       const { metadataTypeId } = concreteType;
//       const metadataForConcreteType = metadataTypeId ? Array.from(this.iterate(metadataTypeId, typeArguments))[0] : null;

//       // Yeild our concrete type
//       yield {
//         type: concreteType.type,
//         metadataTypeId: concreteType.metadataTypeId,
//         concreteTypeId: concreteType.concreteTypeId,

//         components: metadataForConcreteType?.components,
//         typeParameters: metadataForConcreteType?.typeParameters,
//         typeArguments,
//         componentArguments: parentArguments
//       }
//     }

//     if (metadataType) {
//       const componentArguments = (metadataType.typeParameters ?? []).flatMap(
//         (typeParameterId) => Array.from(this.iterate(typeParameterId))
//       )
//         .map(
//           (type, index) => {
//             const typeArgument: any = parentArguments[index];
//             return {
//               ...type,
//             }
//           }
//         )
//       console.log('meta', JSON.stringify({ metadataType, componentArguments }, null, 2))

//       let components = (metadataType.components ?? [])

//       // components.map((component) => {
//       //   const componentType = componentArguments.find((argument) => argument.typeId === component.typeId)
//       //   console.log('componentType', componentType)
//       //   if (componentType) {
//       //     return {
//       //       ...component,
//       //       typeId: componentType.concreteTypeId
//       //     }
//       //   }

//       //   if (component.typeArguments) {
//       //     const typeArguments = component.typeArguments.map((typeArgument) => {
//       //       const argument = componentArguments.find((argument) => argument.typeId === typeArgument.typeId)
//       //       return {
//       //         ...typeArgument,
//       //         typeId: argument?.concreteTypeId,
//       //       }
//       //     })

//       //     return {
//       //       ...component,
//       //       typeArguments,
//       //     }
//       //   }

//       //   return ({
//       //     ...component,
//       //   })
//       // });


//       components = components.flatMap(
//         (component) => Array.from(this.iterate(component.typeId, componentArguments))
//       )

//       yield {
//         type: metadataType.type,
//         metadataTypeId: metadataType.metadataTypeId,
//         concreteTypeId: undefined,

//         components: components,
//         typeParameters: (metadataType?.typeParameters as any[] ?? []),
//         typeArguments: undefined,
//         componentArguments
//       }
//     }
//   }
// }

class TypeIterator implements IterableIterator<any> {

  public constructor(
    private typesRepository: ReturnType<typeof createTypeRepository>
  ) {}

  public static fromFunctionInputs(inputs: )

  // private stack: (string | number)[] = [];
  public *iterate(stack: (string | number)[] = []): IterableIterator<any> {
    const [typeId, ...generics] = stack;
    
    


  }
}

const types = createTypeRepository(abi)
const iterator = new TypeIterator(types)

const concreteType = types.getConcreteTypeById();
const typesIterator = iterator.iterate(concreteType.concreteTypeId);
const parsed = Array.from(typesIterator);

console.log(JSON.stringify(parsed, null, 2))