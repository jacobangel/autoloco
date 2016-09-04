"use strict";

const traverse = require("babel-traverse").default;
const generator = require("babel-generator").default;
const babylon = require("babylon");
const t = require("babel-types");

function parseReplacement(code) {
  return babylon.parse(code, {
    sourceType: "script",
    plugins: ["jsx"]
  }).program.body[0].expression;
}

const parseyDude = function(code, bundle) {
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
           let decl = code.slice(path.node.start + 3, path.node.end - 4);
           if (bundle[decl] !== undefined) {
             let newNode = parseReplacement('<t>' + bundle[decl] + '</t>');
             path.replaceWith(newNode);
           }
        }
      }
    }
  })

  const translated = generator(ast, null, code);
  return translated.code;
}

module.exports = parseyDude;

if (require.main === module) {
  const bundle = {
    'Hello <b>my</b> man!': '!Hola, <em>mi</em> homber!'
  };

  const code = `
  const React = require('react');
  const a = (props) => { return (
      <div>
        <t>Hello <b>my</b> man!</t>
      </div>
    );
  };
  `;
  console.log(parseyDude(code, bundle));
}
