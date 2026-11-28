// The shared kit a domain's components import as @kit/sessionStarts: Core's routes for an agent's session, to create
// a chat's agent, start, switch, interrupt, stop or cancel it and read its accounts.
export { startMain, switchMethod, switchStage } from '@/routes/profiles';
export { recheck, retry } from '@/routes/agents/switch';
export {
    cancelStart,
    checkStart,
    createMain as createMainAgent,
    interrupt as interruptTurn,
    stop as stopSession,
} from '@/routes/agents';
export { dismiss as dismissStartOutcome } from '@/routes/agents/start-outcome';
export { terminal as terminalPage } from '@/routes/web';
export { accounts as accountsPage } from '@/routes/accounts';
export type { EligibleAccountData, EligibleAccountsData } from '@/generated/types/accounts';
