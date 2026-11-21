<?php

declare(strict_types=1);

namespace App\Hooks\Compatibility;

use App\Drivers\Enums\HookDriver;
use App\Hooks\Enums\AuthenticationArrangement;
use App\Hooks\Enums\DriverEvidence;
use App\Hooks\Compatibility\Exceptions\DriverArrangementUnproven;

/**
 * What start preparation may rely on for one pinned program: its version and binary digest, the flags and
 * settings checked against that build, and how starts on one account share its sign-in, with how far that is shown
 * and who shows the rest. Settings text is never taken as proof that the program honours it.
 */
final readonly class DriverCompatibility
{
    /**
     * @param  list<string>  $startFlags  the checked flags every account start passes
     * @param  array<string, string>  $settings  the checked settings each account's own configuration holds
     * @param  string|null  $containedShortfall  what keeps a contained start back; null where starts are not contained
     */
    public function __construct(
        public HookDriver $driver,
        public string $version,
        public string $binaryDigest,
        public array $startFlags,
        public array $settings,
        public AuthenticationArrangement $arrangement,
        public DriverEvidence $arrangementEvidence,
        public string $evidenceOwner,
        public string|null $containedShortfall = null,
    ) {}

    /**
     * What the account-free capture of the pinned build checked. Claude Code runs each start as its own process on
     * the account's directory; Codex runs one app-server that owns the sign-in and each start as a thread on it, its
     * working root an empty trusted folder. How either shares a sign-in needs a signed-in run.
     */
    public static function pinned(HookDriver $driver): self
    {
        return match ($driver) {
            HookDriver::ClaudeCode => new self(
                $driver,
                '2.1.323',
                '5432918d904a9b6afef7bb79d20df24d76052eabc1f41bceb84091d21f8889a7',
                ['--restricted', '--strict-mcp-config', '--mcp-config', '--settings', '--tools'],
                [],
                AuthenticationArrangement::DirectProcesses,
                DriverEvidence::PrerequisiteMissing,
                'the signed-in procedure of docs/accounts/claude-native-evidence.md',
            ),
            HookDriver::Codex => new self(
                $driver,
                '0.165.0',
                'a45099154d7fb4a5ed8a56f40966a95deb938e508bab23e6985035c709e9a85a',
                ['app-server', '--add-dir'],
                ['cli_auth_credentials_store' => 'file'],
                AuthenticationArrangement::SharedOwner,
                DriverEvidence::PrerequisiteMissing,
                'the signed-in procedure of docs/accounts/codex-native-evidence.md',
            ),
        };
    }

    /**
     * The same compatibility with the evidence its arrangement now has, and who shows what it still lacks.
     */
    public function withEvidence(DriverEvidence $evidence, string $owner): self
    {
        return clone ($this, ['arrangementEvidence' => $evidence, 'evidenceOwner' => $owner]);
    }

    /**
     * The same compatibility held back in a container by what its protection report lacks there.
     */
    public function withContainedShortfall(string $shortfall): self
    {
        return clone ($this, [
            'arrangementEvidence' => DriverEvidence::PrerequisiteMissing,
            'evidenceOwner' => "a contained host's protection report with every item enforced",
            'containedShortfall' => $shortfall,
        ]);
    }

    /**
     * Refuses an account start whose way of sharing the sign-in the real program has not shown.
     *
     * @throws DriverArrangementUnproven
     */
    public function assertStartable(): void
    {
        if ($this->containedShortfall !== null) {
            throw DriverArrangementUnproven::inContainer(
                $this->driver->value,
                $this->version,
                $this->containedShortfall,
            );
        }

        if (! $this->arrangementEvidence->isNativeShown()) {
            throw DriverArrangementUnproven::for(
                $this->driver->value,
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
