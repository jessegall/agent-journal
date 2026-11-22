// The shared kit a domain's components import as @kit/jsonRequests: the one client for the journal's JSON routes,
// which owns their headers, errors and parsing.
export { getJson, JsonRequestFailed, postJson } from '@/framework/jsonRequests';
