/* Autogenerated file. Do not edit manually. */

/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-imports */

/*
  Fuels version: 0.94.3
  Forc version: 0.63.1
  Fuel-Core version: 0.34.0
*/

import { ContractFactory, decompressBytecode } from "fuels";
import type { Provider, Account, DeployContractOptions, DeployContractResult } from "fuels";

import { ContractDeepGenerics } from "./ContractDeepGenerics";

const bytecode = decompressBytecode("H4sIAAAAAAAAA5WSvUoDQRSFT2I0sXLwB2SwCKiglQGjIFhs3CwbTYJTWrhEEBEbkVVsbPIIKvhT+ghb+ABbWqa0TKnggo2gpIhnJolC2AguDHNn7nfunNm58j2HMyAJ8w3Ba4cJ0W7rPcg3hSvgxbPfE6KAUBb34JeSSjiTdfkqkP1cxk6rmVStZor8qXQbqEViusuVBnBHmvM2BfwKMmRCtR1Y1GVqUXbUL0IsRHlLucEz82LBfQwZ7/VizxEgnyM/Qj7NnPBLzDn5uioHT4bbZE3G5LK1CCnfQprzsLID5SvmCyu6xomJq1OQr7l+j2XtkUy9wwzHMRtyu4EJ+p+gJ1kBzouYoZ8H48GZC2Pu7nTrBn/UXZe2YS47zHwcMyvLDSxWJ8fPK0hwPc678Tz0c2sxe/mYvSVpAfMc/FcXq5xv2Ay3mU4PSPsB0m3CK3D9wfElcM/cHZmtT8Omeyz7RfR48y5Rqi7tQGsTWnut87/69D/05uwB+rEfry61Ze1VYLcKM7N3rZqj9Tl6z/a0Y1p7eHB84B/td9ofyedvlQ/rGxADAAA=");

export class ContractDeepGenericsFactory extends ContractFactory {

  static readonly bytecode = bytecode;

  constructor(accountOrProvider: Account | Provider) {
    super(bytecode, ContractDeepGenerics.abi, accountOrProvider);
  }

  static async deploy (
    wallet: Account,
    options: DeployContractOptions = {}
  ): Promise<DeployContractResult<ContractDeepGenerics>> {
    const factory = new ContractDeepGenericsFactory(wallet);

    return factory.deploy({
      storageSlots: ContractDeepGenerics.storageSlots,
      ...options,
    });
  }
}
