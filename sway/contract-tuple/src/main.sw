contract;

abi ContractTuple {
    fn tuple(arg1: (u64, u64));
}

impl ContractTuple for Contract {
    fn tuple(arg1: (u64, u64)) {

    }
}