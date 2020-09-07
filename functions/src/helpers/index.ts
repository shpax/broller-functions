import { IRoller, IOpenedAward } from "../models/firestore/interfaces";

export function mapRollerIdFromAtToFb(award: IOpenedAward, rollers: IRoller[]) {
  return {
    ...award,
    rollerId: rollers.find((r) => r.id === award.rollerId)?.firebaseId,
  };
}

export function mapRollerFromAtToFb(roller: IRoller) {
  return {
    ...roller,
    levelId: roller.levelId,
    id: roller.firebaseId,
  };
}
