# schemez

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This library allows users to create JSON schemas and respective TypeScript types in a manner consistent with TypeScript coding. Not only does this reduce code duplication, it makes it simpler for TypeScript developers to learn it.

Heavily based on seemingly abandoned project [jsonschema-definer](https://github.com/Sujimoshi/jsonschema-definer).

Added features like "pick", "omit", and etc, improved code and typescript support, and removed validator to avoid dependency (JSON Schema is public standard).

## 🔥 Install

```sh
#TODO: npm i -D schemez
#TODO: yarn add -D schemez
#TODO: pnpm i -D schemez
```

## 👌 Usage
Basic example

```ts
import s from "schemez";

// Lets define a simple object schema
const UserSchema = s.shape({
  name: s.string(),
  email: s.string().format('email').optional(),
  password: s.string().minLength(8),
  role: s.enum('client', 'suplier'),
  birthday: s.instanceOf(Date)
});

// Now lets get interface of User from schema
type User = typeof UserSchema.type
/*
  type User = {
    name: string,
    email?: string | undefined,
    password: string,
    role: 'client' | 'suplier',
    birthday: Date
  }
*/

// Get plain JSON Schema using .valueOf()
console.log(UserSchema.valueOf())

```
## ⭐️ Show your support

Give a ⭐️ if this project helped you!
## 📚 Documentation

Full documentation available [here](https://takitotech.github.io/schemez/)
### Main exported variable S: <a href="https://takitotech.github.io/schemez/classes/schemafactory.html">SchemaFactory</a> extends <a href="https://takitotech.github.io/schemez/classes/baseschema.html">BaseSchema</a>

<table>
    <tr>
        <th>Method</th>
        <th>Description</th>
				<th>TypeScript</th>
        <th>JSON Schema</th>
    </tr>
    <tr>
        <td>s.any(): <a href="https://takitotech.github.io/schemez/classes/baseschema.html">BaseSchema</a></td>
        <td>Correspond to any type</td>
				<td>any</td>
        <td>{ }</td>
    </tr>
    <tr>
        <td>s.string(): <a href="https://takitotech.github.io/schemez/classes/stringschema.html">StringSchema</a></td>
        <td>For strings validation</td>
				<td>string</td>
        <td>{ "type": "string" }</td>
    </tr>
    <tr>
        <td>s.number(): <a href="https://takitotech.github.io/schemez/classes/numericschema.html">NumericSchema</a></td>
        <td>For float/integer validation</td>
				<td>number</td>
        <td>{ "type": "number" }</td>
    </tr>
    <tr>
        <td>s.integer(): <a href="https://takitotech.github.io/schemez/classes/numericschema.html">NumericSchema</a></td>
        <td>For integer values validation</td>
				<td>number</td>
        <td>{ "type": "integer" }</td>
    </tr>
    <tr>
        <td>s.boolean(): <a href="https://takitotech.github.io/schemez/classes/baseschema.html">BaseSchema</a></td>
        <td>For boolean values</td>
				<td>boolean</td>
        <td>{ "type": "boolean" }</td>
    </tr>
    <tr>
        <td>s.null(): <a href="https://takitotech.github.io/schemez/classes/baseschema.html">BaseSchema</a></td>
        <td>For null value validation</td>
				<td>null</td>
        <td>{ "type": "null" }</td>
    </tr>
    <tr>
        <td>s.array(): <a href="https://takitotech.github.io/schemez/classes/arrayschema.html">ArraySchema</a></td>
        <td>Array validation (more likely you are looking for s.list)</td>
				<td>[]</td>
        <td>{ "type": "array" }</td>
    </tr>
    <tr>
        <td>s.list(itemType: T): <a href="https://takitotech.github.io/schemez/classes/arrayschema.html">ArraySchema</a></td>
        <td>Validation of lists. Example: s.list(s.string()): ArraySchema</td>
				<td>T[]</td>
        <td>{ "type": "array", "items": { ... } }</td>
    </tr>
    <tr>
        <td>s.object(): <a href="https://takitotech.github.io/schemez/classes/objectschema.html">ObjectSchema</a></td>
        <td>Object creation (more likely you are looking for s.shape)</td>
				<td>{}</td>
        <td>{ "type": "object" }</td>
    </tr>
    <tr>
        <td>s.shape({ key: Schema }: T): <a href="https://takitotech.github.io/schemez/classes/objectschema.html">ObjectSchema</a></td>
        <td>Object creation</td>
				<td>{ ... }</td>
        <td>{ "type": "object", properties: T, additionalProperties: false } }</td>
    </tr>
    <tr>
        <td>s.pick(...fields: string[]: T): <a href="https://takitotech.github.io/schemez/classes/objectschema.html">ObjectSchema</a></td>
        <td>Create a new object with chosen fields</td>
				<td>{ ... }</td>
        <td>{ "type": "object", properties: T, additionalProperties: false } }</td>
    </tr>
    <tr>
        <td>s.omit(...fields: string[]: T): <a href="https://takitotech.github.io/schemez/classes/objectschema.html">ObjectSchema</a></td>
        <td>Create a new object with not-chosen fields</td>
				<td>{ ... }</td>
        <td>{ "type": "object", properties: T, additionalProperties: false } }</td>
    </tr>
    <tr>
        <td>s.and(mergeWith: ObjectSchema): <a href="https://takitotech.github.io/schemez/classes/objectschema.html">ObjectSchema</a></td>
        <td>Create a new object that merges with both ObjectSchemas. Similar to typescript's intersection operator (&)</td>
				<td>& (aka. intersection)</td>
        <td>{ "type": "object", properties: T, additionalProperties: false } }</td>
    </tr>
    <tr>
        <td>s.andShape({ key: Schema }: T): <a href="https://takitotech.github.io/schemez/classes/objectschema.html">ObjectSchema</a></td>
        <td>Create a new object that merges with ObjectSchema and new ObjectSchema. Similar to and + shape.</td>
				<td>& (aka. intersection)</td>
        <td>{ "type": "object", properties: T, additionalProperties: false } }</td>
    </tr>
    <tr>
        <td>s.enum(...constants: T[]): <a href="https://takitotech.github.io/schemez/classes/baseschema.html">BaseSchema</a></td>
        <td>Enumerable schema</td>
				<td>A | B | C</td>
        <td>{ enum: [ T[0], T[1] ] }</td>
    </tr>
    <tr>
        <td>s.const(constant: T): <a href="https://takitotech.github.io/schemez/classes/baseschema.html">BaseSchema</a></td>
        <td>Constant value</td>
				<td>const</td>
        <td>{ const: T }</td>
    </tr>
    <tr>
        <td>s.anyOf(...schemas: BaseSchema[]): <a href="https://takitotech.github.io/schemez/classes/baseschema.htmld">BaseSchema</a></td>
        <td>Any (one or more) of given types</td>
				<td>any</td>
        <td>{ anyOf: [ T[0], T[1], ... ] }</td>
    </tr>
    <tr>
        <td>s.oneOf(...schemas: BaseSchema[]): <a href="https://takitotech.github.io/schemez/classes/baseschema.html">BaseSchema</a></td>
        <td>Value shoud correspond to ONE of given types</td>
				<td>any</td>
        <td>{ oneOf: [ T[0], T[1], ... ] }</td>
    </tr>
    <tr>
        <td>s.allOf(...schemas: BaseSchema[]): <a href="https://takitotech.github.io/schemez/classes/baseschema.html">BaseSchema</a></td>
        <td>Value should correspond to ALL of given type</td>
				<td>any</td>
        <td>{ allOf: [ T[0], T[1], ... ] }</td>
    </tr>
    <tr>
        <td>s.raw(values: any): <a href="https://takitotech.github.io/schemez/classes/baseschema.html">BaseSchema</a></td>
        <td>Set custom schema values (For Swagger definitions for example)</td>
				<td>any</td>
        <td>{ ...values }</td>
    </tr>
    <tr>
        <td>s.title(value: string): <a href="https://takitotech.github.io/schemez/classes/baseschema.html">BaseSchema</a></td>
        <td>Add title to schema</td>
				<td>N/A</td>
        <td>{ "title": "string" }</td>
    </tr>
    <tr>
        <td>s.description(value: string): <a href="https://takitotech.github.io/schemez/classes/baseschema.html">BaseSchema</a></td>
        <td>Add description (either string or object that is stringified) to schema</td>
				<td>N/A</td>
        <td>{ "description": "string" }</td>
    </tr>
    <tr>
        <td>s.optional(): <a href="https://takitotech.github.io/schemez/classes/baseschema.html">BaseSchema</a></td>
        <td>Sets field as optional</td>
				<td>? (aka optional operator)</td>
        <td>{ "required": [ ... ] }</td>
    </tr><tr>
        <td>s.optionalAll(): <a href="https://takitotech.github.io/schemez/classes/objectschema.html">ObjectSchema</a></td>
        <td>Sets object and all object fields (recursively) as optional</td>
				<td>{ ...? }</td>
        <td>{ "type": "object", properties: T, additionalProperties: false, "required": [] } }</td>
    </tr>
</table>

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/TakitoTech/schemez/issues).

### Run tests

```sh
npm run test
``` 

## Author

👤 TakitoTech

* Github: [@TakitoTech](https://github.com/TakitoTech)
