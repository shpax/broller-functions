import admin from "firebase-admin";
import _ from "lodash";
import config from "config";

import { IDbInstance, IRoller } from "./interfaces";

const auth = config.firestore
  ? {
      credential: admin.credential.cert(
        config.firestore as admin.ServiceAccount
      ),
    }
  : undefined;

admin.initializeApp(auth);

const db = admin.firestore();

function createSetter(dbName: string) {
  return (data: IDbInstance) => {
    const docRef = db.collection(dbName).doc(data.id);

    return docRef.set(_.omit(data, ["id"]));
  };
}

export const setRoller = createSetter("rollers");
export const setOpenedAward = createSetter("opened_awards");
export const setAward = createSetter("awards");
export const setLevel = createSetter("levels");

export async function pullRollers(fromTimestamp: number) {
  const records = await db
    .collection("rollers")
    .where("updatedAt", ">=", fromTimestamp)
    .get();

  return (records.docs.map((rec) => ({
    firebaseId: rec.id,
    ...rec.data(),
  })) as unknown) as Promise<IRoller[]>;
}
