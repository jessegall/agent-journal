// The shared kit a domain's components import as @kit/jsonRequests: JSON requests to the journal outside an Inertia visit.
export type { JsonReply, PollReply } from '@/framework/jsonRequests';
export {
    deleteJson,
    deleteLeaving,
    getJson,
    pollJson,
    postJson,
    putJson,
} from '@/framework/jsonRequests';
