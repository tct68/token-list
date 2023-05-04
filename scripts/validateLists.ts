import baseswapList from "../baseswap.token-list.json";
import baseswapExperimentalList from "../baseswap-experimental.token-list.json";
import { TokenList } from "@uniswap/token-lists";
import schema from "@uniswap/token-lists/src/tokenlist.schema.json";
import Ajv, { Schema } from "ajv";
import addFormats from "ajv-formats";
import deepmerge from "deepmerge";

export const defaultList: TokenList = baseswapList;
export const experimental: TokenList = baseswapExperimentalList;

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

// Update JSON schema for latest version
const newSchema: Schema = deepmerge(schema, {
  definitions: {
    TokenInfo: {
      properties: {
        name: {
          pattern: "^[ \\w.'+\\-%/À-ÖØ-öø-ÿ:]+$",
        },
        tags: {
          maxItems: schema.definitions.TokenInfo.properties.tags.maxItems,
        },
      },
    },
  },
});
delete newSchema.definitions.TokenInfo.properties.tags.maxLength;

const tokenListValidator = ajv.compile(newSchema);

const validateList = (list: TokenList) => {
  const name = list.name;
  if (!tokenListValidator(list)) {
    console.error(
      "invalid default list",
      JSON.stringify(tokenListValidator.errors, null, 2)
    );
    throw new Error("could not validate list: " + name);
  }
};

[defaultList, experimental].map(validateList);
