// The shared kit a domain's components import as @kit/sessionStarts: Core's routes that start, resume and switch an
// agent's session, settle a switch, open a live session's terminal, read a start's receipt or the host's capacity,
// dismiss a launch outcome, cancel a launch, and the accounts a driver may start with.
export { startMain, startReceipt, switchMethod, switchStage } from '@/routes/profiles';
export { recheck, retry } from '@/routes/agents/switch';
export { cancelLaunch, capacity } from '@/routes/agents';
export { dismiss as dismissLaunchOutcome } from '@/routes/agents/launch-outcome';
export { terminal as terminalPage } from '@/routes/web';
export { accounts as accountsPage } from '@/routes/accounts';
export type { EligibleAccountData, EligibleAccountsData } from '@/generated/types/accounts';
