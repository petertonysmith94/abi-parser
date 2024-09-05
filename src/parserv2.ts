import { readFileSync } from "fs";
import { join } from "path";
import { ConcreteTypeV1, JsonAbiV1, MetadataTypeV1, TypeArgumentV1 } from "./types";

const baseDir = process.cwd();
const abiPath = 'sway/contract-deep-generics/out/release/contract-deep-generics-abi.json'
const abiRaw = readFileSync(join(baseDir, abiPath), 'utf8')
const abi: JsonAbiV1 = JSON.parse(abiRaw)


/**
 * Algorithm
 * 
 * -> Given concrete type ID (a8fccc38f83652e6552bc2465f0f653f7176dfc30f06b930be98b6e2839e421d)
 * -> Get concrete type by ID
```json
{
  "type": "struct GenericNestedLevelOne<u8>",
  "concreteTypeId": "a8fccc38f83652e6552bc2465f0f653f7176dfc30f06b930be98b6e2839e421d",
  "metadataTypeId": 2,
  "typeArguments": [
    "c89951a24c6ca28c13fd1cfdc646b2b656d69e61a92b91023be7eb58eb914b6b"
  ]
},
```
 * -> Get all type arguments by concrete type ID
```json
{
  "type": "struct GenericNestedLevelOne<u8>",
  "concreteTypeId": "a8fccc38f83652e6552bc2465f0f653f7176dfc30f06b930be98b6e2839e421d",
  "metadataTypeId": 2,
  "typeArguments": [
    {
      "type": "u8",
      "concreteTypeId": "c89951a24c6ca28c13fd1cfdc646b2b656d69e61a92b91023be7eb58eb914b6b"
    }
  ]
},
```

---

 * -> If has `metadataTypeId`
 * -> Get metadata type by ID (2)
```json
{
  "type": "struct GenericNestedLevelOne",
  "metadataTypeId": 2,
  "components": [
    {
      "name": "one",
      "typeId": 3,
      "typeArguments": [
        {
          "name": "",
          "typeId": 0
        }
      ]
    }
  ],
  "typeParameters": [
    0
  ]
},
```

---

 * -> Map concrete and metadata types together
```json
{
  "concreteType": "struct GenericNestedLevelOne<u8>",
  "metadataType": "struct GenericNestedLevelOne",

  "concreteTypeId": "a8fccc38f83652e6552bc2465f0f653f7176dfc30f06b930be98b6e2839e421d",
  "metadataTypeId": 2,

  "typeParameters": [
    0
  ]
  "typeArguments": [
    {
      "type": "u8",
      "concreteTypeId": "c89951a24c6ca28c13fd1cfdc646b2b656d69e61a92b91023be7eb58eb914b6b"
    }
  ],

  // A formation of "typeParameters" and "typeArguments"
  "componentArguments": [
    {
      "type": "u8",
      "parameterId": 0,
      "argumentId": "c89951a24c6ca28c13fd1cfdc646b2b656d69e61a92b91023be7eb58eb914b6b"
    }
  ]
  "components": [
    {
      "name": "one",
      "typeId": 3,
      "typeArguments": [
        {
          "name": "",
          "typeId": 0
        }
      ]
    }
  ]
}
```

 * -> Loop over components
```json components[0]
{
  "name": "one",
  "typeId": 3,
  "typeArguments": [
    {
      "name": "",
      "typeId": 0
    }
  ]
}
 * 
 * -> Get type by `typeId` metadata type ID or concrete type ID (7)
```json
{
  "type": "struct GenericNestedLevelTwo",
  "metadataTypeId": 3,
  "components": [
    {
      "name": "two",
      "typeId": 1
    }
  ],
  "typeParameters": [
    1
  ]
}
```
 * -> Map concrete and metadata types together
```json
{
  "concreteType": undefined,
  "metadataType": "struct GenericNestedLevelTwo",

  "concreteTypeId": undefined,
  "metadataTypeId": 3,

  "typeParameters": [
    1
  ],
  "typeArguments": [
    {
      "name": "",
      "typeId": 0
    }
  ],

  "componentArguments": [
    {
      "name": "",
      "parameterId": 1,
      "argumentId": 0
    }
  ],
  "components": [
    {
      "name": "two",
      "typeId": 1
    }
  ]
}
```

---
### Loop over components (again)

 * -> Loop over components
```json components[0]
{
  "name": "two",
  "typeId": 6,
  "typeArguments": [
    {
      "name": "",
      "typeId": 3
    }
  ]
}
 * -> Get type by `typeId` metadata type ID or concrete type ID (7)

 */