## Summary

Sway [alias types](https://docs.fuel.network/docs/sway/advanced/advanced_types/) seem to differ from types defined inline.

The `metadataTypes.type` for the tuple `(u64, u64)` is generated as `(_, _)` when defined inline, but as `(u64, u64)` when defined as an alias.

### Inline types

Inline types generates the following [ABI](./sway/contract-tuple/out/release/contract-tuple-abi.json).

<details>
  <summary>See more</summary>

```sw
abi ContractTuple {
  fn tuple(arg1: (u64, u64));
}
```

```json
{
  "concreteTypes": [
    {
      "type": "()",
      "concreteTypeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
    },
    {
      "type": "(u64, u64)",
      "concreteTypeId": "41bd1a98f0a59642d8f824c805b798a5f268d1f7d05808eb05c4189c493f1be0",
      "metadataTypeId": 0
    }
  ],
  "metadataTypes": [
    {
      "type": "(_, _)",
      "metadataTypeId": 0,
      "components": [
        {
          "name": "__tuple_element",
          "typeId": 1
        },
        {
          "name": "__tuple_element",
          "typeId": 1
        }
      ]
    },
    {
      "type": "u64",
      "metadataTypeId": 1
    }
  ],
}
```

</details>

### Aliased types

Aliased types generates the following [ABI](./sway/contract-tuple-alias/out/release/contract-tuple-alias-abi.json).

<details>
  <summary>See more</summary>

```sw
type AliasedTuple = (u64, u64);

abi ContractTupleAlias {
    fn tuple(arg1: AliasedTuple);
}
```

```json
{
  "concreteTypes": [
    {
      "type": "()",
      "concreteTypeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
    },
    {
      "type": "(u64, u64)",
      "concreteTypeId": "41bd1a98f0a59642d8f824c805b798a5f268d1f7d05808eb05c4189c493f1be0",
      "metadataTypeId": 0
    }
  ],
  "metadataTypes": [
    {
      "type": "(u64, u64)",
      "metadataTypeId": 0,
      "components": [
        {
          "name": "__tuple_element",
          "typeId": 1
        },
        {
          "name": "__tuple_element",
          "typeId": 1
        }
      ]
    },
    {
      "type": "u64",
      "metadataTypeId": 1
    }
  ],
}
```

</details>


## Steps to reproduce

- Run the following command to install dependencies:

```bash
pnpm install
```

- Run the build command:

```bash
pnpm build
```

- Expected output: The build should succeed.
- Actual output: The build fails with the following error:

```bash
Type not supported: (u64, u64)
```