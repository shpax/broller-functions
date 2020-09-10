import Airtable from "airtable";
import config from "config";
import _ from "lodash";
import {
  BASE_AWARDS,
  BASE_LEVELS,
  BASE_OPENED_AWARDS,
  BASE_ROLLERS,
  IBaseConstants,
} from "./constants";
import { IRoller, IAward, ILevel, IOpenedAward } from "../firestore/interfaces";

const { apiKey, baseName } = config.airtable;

const base = new Airtable({ apiKey }).base(baseName);

function createBaseGetter<T>(
  { NAME, FIELDS }: IBaseConstants,
  transform?: (data: any) => any
) {
  return (filterByFormula = "") => {
    return new Promise<T[]>((resolve, reject) => {
      const pages: any[] = [];

      base(NAME)
        .select({
          fields: _.values(FIELDS),
          filterByFormula,
        })
        .eachPage(
          function page(records: any[], fetchNextPage: () => void) {
            pages.push(records);

            fetchNextPage();
          },
          function done(err: any) {
            if (err) {
              reject(err);
            } else {
              const records = _.flatten(pages);
              const data = records.map((r) => {
                const id = r.getId();

                const record = _.toPairs(FIELDS).reduce(
                  (obj, [key, value]) => {
                    return _.set(obj, key, r.get(value) || null);
                  },
                  { id }
                );

                return transform ? transform(record) : record;
              });

              resolve(data as T[]);
            }
          }
        );
    });
  };
}

export const getRollers = createBaseGetter<IRoller>(BASE_ROLLERS, (record) => {
  return {
    ..._.omit(record, ["levelIds", "awardIds"]),
    levelId: _.get(record, "levelIds[0]", null),
    // photo: _.get(record, "photo[0].url", null),
  };
});
export const getAwards = createBaseGetter<IAward>(BASE_AWARDS, (record) => {
  return {
    ..._.omit(record, ["levelIds"]),
    levelId: _.get(record, "levelIds[0]", null),
    order: +_.get(record, "order", 0),
  };
});
export const getOpenedAwards = createBaseGetter<IOpenedAward>(
  BASE_OPENED_AWARDS,
  (record) => {
    return {
      ..._.omit(record, ["awardIds", "rollerIds"]),
      awardId: _.get(record, "awardIds[0]", null),
      rollerId: _.get(record, "rollerIds[0]", null),
    };
  }
);
export const getLevels = createBaseGetter<ILevel>(BASE_LEVELS, (record) => {
  return {
    ...record,
    awardOpenedPicture: _.get(record, "awardOpenedPicture[0].url", null),
    awardClosedPicture: _.get(record, "awardClosedPicture[0].url", null),
    picture: _.get(record, "picture[0].url", null),
  };
});

export async function updateRollers(data: IRoller[]) {
  const phonesStr = data
    .map((roller) => `{${BASE_ROLLERS.FIELDS.phone}} = "${roller.phone}"`)
    .join(", ");
  const phonesFilter = `OR(${phonesStr})`;
  const existingRollers = await getRollers(phonesFilter);

  const createRecords: object[] = [];
  const updateRecords: object[] = [];

  data.forEach((roller) => {
    const query = {
      id: (existingRollers.find((r) => r.phone === roller.phone) || {}).id,
      fields: {
        [BASE_ROLLERS.FIELDS.name]: roller.name,
        [BASE_ROLLERS.FIELDS.photo]: roller.photo,
        [BASE_ROLLERS.FIELDS.phone]: roller.phone,
        [BASE_ROLLERS.FIELDS.birthdate]: roller.birthdate,
        [BASE_ROLLERS.FIELDS.firebaseId]: roller.firebaseId,
      },
    };

    if (query.id) updateRecords.push(query);
    else {
      delete query.id;
      createRecords.push(query);
    }
  });

  if (createRecords.length) {
    await Promise.all(
      _.chunk(createRecords, 10).map((queries) => {
        return new Promise((resolve, reject) => {
          base(BASE_ROLLERS.NAME).create(
            queries,
            (err: Error, recs: object[]) => {
              if (err) reject(err);
              else resolve(recs);
            }
          );
        });
      })
    );
  }

  if (updateRecords.length) {
    await Promise.all(
      _.chunk(updateRecords, 10).map((queries) => {
        return new Promise((resolve, reject) => {
          base(BASE_ROLLERS.NAME).update(
            queries,
            (err: Error, recs: object[]) => {
              if (err) reject(err);
              else resolve(recs);
            }
          );
        });
      })
    );
  }
}
