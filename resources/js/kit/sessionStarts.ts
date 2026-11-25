// The shared kit a domain's components import as @kit/sessionStarts: Core's routes that start, resume and switch an
// agent's session, settle a switch, open a live session's terminal, dismiss a start outcome, cancel a start, check a
// start whose session is not verified yet, and the accounts a driver may start with.
export { startMain, switchMethod, switchStage } from '@/routes/profiles';
export { recheck, retry } from '@/routes/agents/switch';
export { cancelStart, checkStart, interrupt as interruptTurn, stop as stopSession } from '@/routes/agents';
export { dismiss as dismissStartOutcome } from '@/routes/agents/start-outcome';
export { terminal as terminalPage } from '@/routes/web';
export { accounts as accountsPage } from '@/routes/accounts';
export type { EligibleAccountData, EligibleAccountsData } from '@/generated/types/accounts';
