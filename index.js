"use strict";

const traverse = require("babel-traverse").default;
const generator = require("babel-generator").default;
const babylon = require("babylon");
const t = require("babel-types");

const bundle = {
  'Hello my man!': '"!Hola, <em>mi</em> homber!"'
};
const code = `
console.log('sup');
const React = require('react');
const a = (props) => { return (
    <div>
      <t>Hello <b>my</b> man!</t>
    </div>
  );
};
`;

const ast = babylon.parse(code, {
  sourceType: "module",
  plugins: ["jsx"]
});

traverse(ast, {
  JSXElement(path) {
    if (t.isJSXOpeningElement(path.node.openingElement)) {
      if (t.isJSXIdentifier(path.node.openingElement.name, {
        name: 't'
      })) {
         // console.log(path);
         let decl = code.slice(path.node.start + 3, path.node.end - 4);
         if (bundle[decl]) {
           path.replaceWithSourceString(bundle[decl])
         }
         console.log('substring : ', decl, path.node.start, path.node.end);
         // path.replaceWithSourceString(bundle);
      }
    }
    // console.log(path);
  }
})

const newCode = generator(ast, null, code);
console.log(newCode);
