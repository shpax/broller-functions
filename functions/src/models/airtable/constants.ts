export interface IBaseConstants {
  NAME: string;
  FIELDS: {
    [index: string]: string;
  };
}

export const BASE_ROLLERS: IBaseConstants = {
  NAME: "Ученики",
  FIELDS: {
    name: "Имя",
    photo: "Фото",
    phone: "Номер телефона",
    birthdate: "Дата рождения",
    awardIds: "Награды",
    levelIds: "Текущий уровень",
  },
};

export const BASE_OPENED_AWARDS: IBaseConstants = {
  NAME: "Открытые Награды",
  FIELDS: {
    video: "Видео",
    rollerIds: "Ученик",
    awardIds: "Награда",
  },
};

export const BASE_AWARDS: IBaseConstants = {
  NAME: "Список Наград",
  FIELDS: {
    name: "Название",
    photo: "Картинка",
    desc: "Описание",
    levelIds: "Уровень",
  },
};

export const BASE_LEVELS: IBaseConstants = {
  NAME: "Уровни",
  FIELDS: {
    name: "Название",
    photo: "Картинка",
    difficulty: "Сложность",
  },
};
