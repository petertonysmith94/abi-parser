/**
 * Types for Fuel JSON ABI Format specification v1, as defined on:
 * https://github.com/FuelLabs/fuel-specs/blob/master/src/abi/json-abi-format.md
 */

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface JsonAbiV1 {
  readonly specVersion: string;
  readonly encodingVersion: string;
  readonly programType: string;
  readonly concreteTypes: readonly ConcreteTypeV1[];
  readonly metadataTypes: readonly MetadataTypeV1[];
  readonly functions: readonly AbiFunctionV1[];
  readonly loggedTypes: readonly LoggedTypeV1[];
  readonly messagesTypes: readonly MessageTypeV1[];
  readonly configurables: readonly ConfigurableV1[];
}

export interface ConcreteTypeV1 {
  readonly type: string;
  readonly metadataTypeId?: number;

  readonly concreteTypeId: string;
  readonly typeArguments?: readonly string[];
}

export interface MetadataTypeV1 {
  readonly type: string;
  readonly metadataTypeId: number;

  readonly components?: readonly ComponentV1[];
  readonly typeParameters?: readonly number[];
}

export interface ComponentV1 extends TypeArgumentV1 {
  readonly name: string;
}

export interface TypeArgumentV1 {
  readonly typeId: number | string; // the type metadata declaration ID or type concrete declaration hash based ID of the type of the component.
  readonly typeArguments?: readonly TypeArgumentV1[];
}

export interface AbiFunctionV1 {
  readonly name: string;
  readonly inputs: readonly AbiFunctionInputV1[];
  readonly output: string;
  readonly attributes: readonly AbiFunctionAttributeTodoV1[] | null;
}

export interface AbiFunctionInputV1 {
  readonly name: string;
  readonly concreteTypeId: string;
}

type AbiFunctionAttributeTodoV1 =
  | StorageAttr
  | PayableAttr
  | TestAttr
  | InlineAttr
  | DocCommentAttr
  | DocAttr;

export interface PayableAttr {
  readonly name: 'payable';
}
export interface StorageAttr {
  readonly name: 'storage';
  readonly arguments: readonly ('read' | 'write')[];
}
export interface TestAttr {
  readonly name: 'test';
}
export interface InlineAttr {
  readonly name: 'inline';
  readonly arguments: 'never' | 'always';
}
export interface DocCommentAttr {
  readonly name: 'doc-comment';
  readonly arguments: string[];
}
export interface DocAttr {
  readonly name: 'doc';
}

export interface LoggedTypeV1 {
  readonly logId: string;
  readonly concreteTypeId: string; // the _type concrete declaration_ hash based ID of the value being logged.
}

export interface MessageTypeV1 {
  readonly message_id: string;
  readonly concreteTypeId: string;
}

export interface ConfigurableV1 {
  readonly name: string;
  readonly concreteTypeId: string;
  readonly offset: number;
}