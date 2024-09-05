# Algorithm

## Sway

```rust
contract;

struct GenericNestedLevelTwo<Two> {
  two: Two
}

struct GenericNestedLevelOne<One> {
  one: GenericNestedLevelTwo<One>,
}

abi ContractTuple {
    fn generic(arg1: GenericNestedLevelOne<u8>);
}

impl ContractTuple for Contract {
    fn generic(arg1: GenericNestedLevelOne<u8>) {

    }
}
```

## ABI

```json
{
  "programType": "contract",
  "specVersion": "1",
  "encodingVersion": "1",
  "concreteTypes": [
    {
      "type": "()",
      "concreteTypeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
    },
    {
      "type": "struct GenericNestedLevelOne<u8>",
      "concreteTypeId": "a8fccc38f83652e6552bc2465f0f653f7176dfc30f06b930be98b6e2839e421d",
      "metadataTypeId": 2,
      "typeArguments": [
        "c89951a24c6ca28c13fd1cfdc646b2b656d69e61a92b91023be7eb58eb914b6b"
      ]
    },
    {
      "type": "u8",
      "concreteTypeId": "c89951a24c6ca28c13fd1cfdc646b2b656d69e61a92b91023be7eb58eb914b6b"
    }
  ],
  "metadataTypes": [
    {
      "type": "generic One",
      "metadataTypeId": 0
    },
    {
      "type": "generic Two",
      "metadataTypeId": 1
    },
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
  ],
  "functions": [
    {
      "inputs": [
        {
          "name": "arg1",
          "concreteTypeId": "a8fccc38f83652e6552bc2465f0f653f7176dfc30f06b930be98b6e2839e421d"
        }
      ],
      "name": "generic",
      "output": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d",
      "attributes": null
    }
  ],
  "loggedTypes": [],
  "messagesTypes": [],
  "configurables": []
}
```


# Step By Step analysis

-> Input: `string` (concrete type or metadata type ID)

## Get concrete type

- Given concrete type ID (a8fccc38f83652e6552bc2465f0f653f7176dfc30f06b930be98b6e2839e421d)
- Get concrete type by ID

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

- Get all type arguments by concrete type ID

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

- Get metadata type by ID (2)
  (if available)

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

## Map concrete and metadata types together
```json
{
  "concreteType": "struct GenericNestedLevelOne<u8>",
  "metadataType": "struct GenericNestedLevelOne",

  "concreteTypeId": "a8fccc38f83652e6552bc2465f0f653f7176dfc30f06b930be98b6e2839e421d",
  "metadataTypeId": 2,

  "typeParameters": [
    0
  ],
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
  ],
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

## Loop over components
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
 
## Get type by `typeId` metadata type ID or concrete type ID (7)

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
## Map concrete and metadata types together
```json
{
  "concreteType": null,
  "metadataType": "struct GenericNestedLevelTwo",

  "concreteTypeId": null,
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

## Loop over components

```json components[0]
{
  "name": "two",
  "typeId": 1
}
```

## Get type by `typeId` metadata type ID or concrete type ID (7)
