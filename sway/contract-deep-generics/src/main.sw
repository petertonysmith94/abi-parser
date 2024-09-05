contract;

// struct GenericNestedLevelFour<Four> {
//   four: Four
// }

// struct GenericNestedLevelThree<Three> {
//   three: GenericNestedLevelFour<Three>
// }

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