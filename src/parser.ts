import { readFileSync } from "fs";
import { join } from "path";
import { ConcreteTypeV1, JsonAbiV1, MetadataTypeV1 } from "./types";

const baseDir = process.cwd();
const abiPath = 'sway/contract-deep-generics/out/release/contract-tuple-abi.json'
const abiRaw = readFileSync(join(baseDir, abiPath), 'utf8')
const abi: JsonAbiV1 = JSON.parse(abiRaw)

const types = []

// Collate types
const metadataTypes = new Map(
  abi.metadataTypes.map((metadataType) => [metadataType.metadataTypeId, metadataType])
)
const concreteTypes = new Map(
  abi.concreteTypes.map((concreteType) => [concreteType.concreteTypeId, concreteType])
)

const getConcreteTypeById = (id: string) => {
  const concreteType = concreteTypes.get(id)
  if (!concreteType) {
    throw new Error(`Concrete type with ID ${id} not found`)
  }
  return concreteType
}

const getMetadataTypeById = (id: number) => {
  const metadataType = metadataTypes.get(id)
  if (!metadataType) {
    throw new Error(`Metadata type with ID ${id} not found`)
  }
  return metadataType
}

// class TypeIterator {
//   constructor(
//     private readonly metadataType: Map<number, MetadataTypeV1>,
//     private readonly concreteType: Map<string, ConcreteTypeV1>,
//   ) {}

//   public *iterate(stack: (string | number)[] = []): IterableIterator<any> {
//     const [typeId, ...generics] = stack;
    
//     if (typeof typeId === 'string') {
//       // const concreteType: ConcreteTypeV1 = getConcreteTypeById(typeId);

//       // if (concreteType.typeArguments) {
//       //   concreteType.typeArguments = concreteType.typeArguments.flatMap(
//       //     (typeArgumentId) => Array.from(this.iterate(typeArgumentId))
//       //   )
//       // }

//       // if (concreteType.metadataTypeId) {
//       //   concreteType.metadataType = Array.from(
//       //     this.iterate(concreteType.metadataTypeId, concreteType.typeArguments)
//       //   )[0];
//       // }

//       yield concreteType
//     }

//     if (typeof typeId === 'number') {
//       // let { typeParameters, ...metadataType }: MetadataTypeV1 = getMetadataTypeById(typeId);

//       // if (typeArguments) {
//       //   metadataType.typeArguments = typeArguments;
//       // }

//       // if (typeParameters) {
//       //   typeParameters = typeParameters.flatMap(
//       //     (typeParameterId) => Array.from(this.iterate(typeParameterId))
//       //   )
//       //   // generics = typeParameters.reduce((acc, typeParameter, index) => {
//       //   //   acc[index] = {
//       //   //     ...typeParameter,
//       //   //     ...typeArguments[index]
//       //   //   }
//       //   //   return acc
//       //   // }, [])
//       //   metadataType.typeParameters = typeParameters;
//       // }

//       // if (metadataType.components) {
//       //   metadataType.components = metadataType.components.flatMap(
//       //     (component) => Array.from(this.iterate(component.typeId, generics))
//       //   )
//       // }
//       yield { ...metadataType, generics }
//     }
//   }
// }



const iterator = new TypeIterator(metadataTypes, concreteTypes)

const concreteType = getConcreteTypeById(abi.functions[0].inputs[0].concreteTypeId);
const typesIterator = iterator.iterate(abi.functions[0].inputs[0].concreteTypeId)

console.log(JSON.stringify(Array.from(typesIterator), null, 2))