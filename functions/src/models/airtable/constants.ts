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
    firebaseId: "Айди",
    photo: "Фото",
    phone: "Номер телефона",
    birthdate: "Дата рождения",
    awardIds: "Награды",
    playlist: "Ссылка на плейлист",
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
    video: "Ссылка на видео",
    desc: "Описание",
    levelIds: "Уровень",
    order: "Порядковый номер",
  },
};

export const BASE_LEVELS: IBaseConstants = {
  NAME: "Уровни",
  FIELDS: {
    name: "Название",
    difficulty: "Сложность",
    awardOpenedPicture: "Ачивка открыта",
    awardClosedPicture: "Ачивка закрыта",
    picture: "Уровень открыт",
  },
};
