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

export const rollers = functions.https.onRequest(async (request, response) => {
  const rollers = await getRollers();
  response.send(rollers);
});

export const openedAwards = functions.https.onRequest(
  async (request, response) => {
    const rollers = await getOpenedAwards();
    response.send(rollers);
  }
);

export const awardsList = functions.https.onRequest(
  async (request, response) => {
    const rollers = await getAwards();

    response.send(rollers);
  }
);

export const levels = functions.https.onRequest(async (request, response) => {
  const rollers = await getLevels();
  response.send(rollers);
});

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

export const pullRollersToAT = functions.https.onRequest(
  async (request, response) => {
    const rollers = await pullRollers(Date.now() - 24 * 60 * 60 * 1000);

    await updateRollers(rollers);

    response.send("done");
  }
);

export const pullAwardsToFireStore = functions.https.onRequest(
  async (request, response) => {
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

    response.send("done");
  }
);
