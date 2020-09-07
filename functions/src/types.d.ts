declare type AirtableConfig = typeof import("../config/airtable");

declare module "config" {
  const airtable: AirtableConfig;
  const firestore: object;
}

declare module "airtable";
