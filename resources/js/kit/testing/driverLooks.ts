import type { DriverLookData } from '@/types/generated';

// The looks the server declares for the two families every journal ships, as a test's page props carry them.
export const declaredLooks: DriverLookData[] = [
    {
        family: 'claude-code',
        label: 'Claude Code',
        aliases: ['claude', 'claude-code-headless'],
        markUrl: '/images/drivers/claude-code.svg',
        markTone: 'own',
        signInCode: 'paste-back',
    },
    {
        family: 'codex',
        label: 'Codex',
        aliases: ['codex-headless'],
        markUrl: '/images/drivers/codex.svg',
        markTone: 'current-color',
        signInCode: 'outgoing',
    },
];
