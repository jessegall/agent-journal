// the rows of the counts list: every profile of an agent type that has profiles, even one with no agent yet, else the type itself
export const countEntries = (rows) => rows.flatMap((row) => row.per_profile ? row.profiles.map((profile) => ({...profile, label: profile.title, type: row.key, key: `${row.key}:${profile.profile}`})) : [{...row, type: row.key}]);
export {isFull} from "@journal/setting-components";
