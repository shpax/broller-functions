export interface IDbInstance {
  id: string;
}

export interface IRoller extends IDbInstance {
  name: string;
  photo: string;
  phone: string;
  birthdate: string;
  awardIds: string[];
  levelId: string;
}

export interface IOpenedAward extends IDbInstance {
  video: string;
  rollerId: string;
  awardId: string;
}

export interface IAward extends IDbInstance {
  name: string;
  photo: string;
  desc: string;
  levelId: string;
}

export interface ILevel extends IDbInstance {
  name: string;
  photo: string;
  difficulty: string;
}
