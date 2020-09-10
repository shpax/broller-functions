import * as functions from "firebase-functions";
import _ from "lodash";
import {
  getRollers,
  getAwards,
  getLevels,
  getOpenedAwards,
  updateRollers,
} from "./models/airtable";
import {
  setRoller,
  setLevel,
  setOpenedAward,
  setAward,
  pullRollers,
} from "./models/firestore";
import { mapRollerIdFromAtToFb, mapRollerFromAtToFb } from "./helpers";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

export const getAtRollers = functions.https.onRequest(
  async (request, response) => {
    const rollers = await getRollers();
    response.send(rollers);
  }
);

export const getAtOpenedAwards = functions.https.onRequest(
  async (request, response) => {
    const rollers = await getOpenedAwards();
    response.send(rollers);
  }
);

export const getAtAwards = functions.https.onRequest(
  async (request, response) => {
    const rollers = await getAwards();

    response.send(rollers);
  }
);

export const getAtLevels = functions.https.onRequest(
  async (request, response) => {
    const rollers = await getLevels();
    response.send(rollers);
  }
);

export const migrateRollers = functions.https.onRequest(
  async (request, response) => {
    const [rollers, openedAwards, awards, levels] = await Promise.all([
      getRollers(),
      getOpenedAwards(),
      getAwards(),
      getLevels(),
    ]);

    await Promise.all(
      _.flatten([
        rollers.map(setRoller),
        openedAwards.map(setOpenedAward),
        awards.map(setAward),
        levels.map(setLevel),
      ])
    );

    response.send("done");
  }
);

const pullRollersToAtFunc = async () => {
  const rollers = await pullRollers(Date.now() - 24 * 60 * 60 * 1000);

  await updateRollers(rollers);
};

export const pullRollersToAT = functions.https.onRequest(
  async (request, response) => {
    await pullRollersToAtFunc();

    response.send("done");
  }
);

const pullAwardsToFireStoreFunc = async () => {
  const [rollers, openedAwards, awards, levels] = await Promise.all([
    getRollers(),
    getOpenedAwards(),
    getAwards(),
    getLevels(),
  ]);

  await Promise.all(
    _.flatten([
      rollers
        .filter((roller) => !!roller.id)
        .map((roller) => setRoller(mapRollerFromAtToFb(roller))),
      openedAwards.map(
        (award) => setOpenedAward(mapRollerIdFromAtToFb(award, rollers)) // todo: possibly CPU intencive task
      ),
      awards.map(setAward),
      levels.map(setLevel),
    ])
  );
};

export const pullAwardsToFireStore = functions.https.onRequest(
  async (request, response) => {
    await pullAwardsToFireStoreFunc();

    response.send("done");
  }
);

export const runSyncHttp = functions.https.onRequest(
  async (request, response) => {
    await pullRollersToAtFunc();
    await pullAwardsToFireStoreFunc();

    response.send("done");
  }
);

export const runSync = functions.pubsub
  .schedule("0 0/6 * * *")
  .timeZone("Europe/Kiev")
  .onRun(async () => {
    await pullRollersToAtFunc();
    await pullAwardsToFireStoreFunc();
    return null;
  });
