import admin from "firebase-admin";
import _ from "lodash";

import serviceAccount from "../../../config/sdk-key";
import { IDbInstance } from "./interfaces";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

let db = admin.firestore();

function createSetter(dbName: string) {
  return (data: IDbInstance) => {
    const docRef = db.collection(dbName).doc(data.id);

    docRef.set(_.omit(data, ["id"]));
  };
}

export const setRoller = createSetter("rollers");
export const setOpenedAward = createSetter("opened_awards");
export const setAward = createSetter("awards");
export const setLevel = createSetter("levels");
