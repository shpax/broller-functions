declare type AirtableConfig = typeof import("../config/airtable");

declare module "config" {
  const airtable: AirtableConfig;
}

declare module "airtable";
