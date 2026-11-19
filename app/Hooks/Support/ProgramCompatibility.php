<?php

declare(strict_types=1);

namespace App\Hooks\Support;

use App\Hooks\Enums\AuthenticationArrangement;
use App\Hooks\Enums\ProgramEvidence;
use App\Hooks\Exceptions\ProgramArrangementUnproven;
use App\Programs\Enums\HookProgram;

/**
 * What launch preparation may rely on for one pinned program: its version and binary digest, the flags and
 * settings checked against that build, and how launches on one account share its sign-in, with how far that is shown
 * and who shows the rest. Settings text is never taken as proof that the program honours it.
 */
final readonly class ProgramCompatibility
{
    /**
     * @param  list<string>  $launchFlags  the checked flags every account launch passes
     * @param  array<string, string>  $settings  the checked settings each account's own configuration holds
     */
    public function __construct(
        public HookProgram $program,
        public string $version,
        public string $binaryDigest,
        public array $launchFlags,
        public array $settings,
        public AuthenticationArrangement $arrangement,
        public ProgramEvidence $arrangementEvidence,
        public string $evidenceOwner,
    ) {}

    /**
     * What the account-free capture of the pinned build checked. Claude Code runs each launch as its own process on
     * the account's directory; Codex runs one app-server that owns the sign-in and each launch as a thread on it, its
     * working root an empty trusted folder. How either shares a sign-in needs a signed-in run.
     */
    public static function pinned(HookProgram $program): self
    {
        return match ($program) {
            HookProgram::ClaudeCode => new self(
                $program,
                '2.1.323',
                '5432918d904a9b6afef7bb79d20df24d76052eabc1f41bceb84091d21f8889a7',
                ['--restricted', '--strict-mcp-config', '--mcp-config', '--settings', '--tools'],
                [],
                AuthenticationArrangement::DirectProcesses,
                ProgramEvidence::PrerequisiteMissing,
                'the signed-in procedure of docs/accounts/claude-native-evidence.md',
            ),
            HookProgram::Codex => new self(
                $program,
                '0.165.0',
                'a45099154d7fb4a5ed8a56f40966a95deb938e508bab23e6985035c709e9a85a',
                ['app-server', '--add-dir'],
                ['cli_auth_credentials_store' => 'file'],
                AuthenticationArrangement::SharedOwner,
                ProgramEvidence::PrerequisiteMissing,
                'the signed-in procedure of docs/accounts/codex-native-evidence.md',
            ),
        };
    }

    /**
     * Refuses an account launch whose way of sharing the sign-in the real program has not shown.
     *
     * @throws ProgramArrangementUnproven
     */
    public function requireLaunchable(): void
    {
        if (! $this->arrangementEvidence->isNativeShown()) {
            throw ProgramArrangementUnproven::for(
                $this->program->value,
                $this->version,
                $this->arrangement,
                $this->arrangementEvidence,
                $this->evidenceOwner,
            );
        }
    }

    /**
     * Whether the installed binary is the one the flags and settings were checked against.
     */
    public function isPinnedBinary(string $digest): bool
    {
        return hash_equals($this->binaryDigest, $digest);
    }
}
