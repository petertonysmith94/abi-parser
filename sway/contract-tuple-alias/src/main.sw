contract;

type AliasedTuple = (u64, u64);

abi ContractTupleAlias {
    fn tuple(arg1: AliasedTuple);
}

impl ContractTupleAlias for Contract {
    fn tuple(arg1: AliasedTuple) {

    }
}