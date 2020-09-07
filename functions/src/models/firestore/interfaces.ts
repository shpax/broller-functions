export interface IDbInstance {
  id: string;
}

export interface IRoller extends IDbInstance {
  firebaseId: string;
  name: string;
  photo: string;
  phone: string;
  birthdate: string;
  awardIds: string[];
  levelId: string;
  playlist: string;
}

export interface IOpenedAward extends IDbInstance {
  video: string;
  rollerId: string;
  awardId: string;
}

export interface IAward extends IDbInstance {
  name: string;
  video: string;
  desc: string;
  levelId: string;
}

export interface ILevel extends IDbInstance {
  name: string;
  difficulty: string;
  awardOpenedPicture: string;
  awardClosedPicture: string;
  picture: string;
}
