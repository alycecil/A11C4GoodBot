declare module "edit-distance" {
    export function levenshtein(stringA: string, stringB: string, insertCb: any, removeCb: any, updateCb: any): Mapping;
}
