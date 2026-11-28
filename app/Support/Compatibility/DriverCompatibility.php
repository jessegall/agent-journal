<?php

declare(strict_types=1);

namespace App\Support\Compatibility;

use App\Accounts\Enums\AuthenticationArrangement;
use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Enums\DriverEvidence;
use App\Exceptions\DriverFamilyUnknown;
use App\Support\Compatibility\Exceptions\DriverArrangementUnproven;

/**
 * What start preparation may rely on for one pinned driver: its version and binary digest, the flags and
 * settings checked against that build, and how starts on one account share its sign-in, with how far that is shown
 * and who shows the rest. Settings text is never taken as proof that the driver honours it.
 */
final readonly class DriverCompatibility
{
    /**
     * @param  list<string>  $startFlags  the checked flags every account start passes
     * @param  array<string, string>  $settings  the checked settings each account's own configuration holds
     */
    public function __construct(
        public string $driver,
        public string $version,
        public string $binaryDigest,
        public array $startFlags,
        public array $settings,
        public AuthenticationArrangement $arrangement,
        public DriverEvidence $arrangementEvidence,
        public string $evidenceOwner,
    ) {}

    /**
     * The checked compatibility of the driver's build, at the version its recipe folder pins (PinnedBuilds).
     *
     * @throws DriverFamilyUnknown for a family no build is pinned for
     */
    public static function pinned(string $driver, string $version): self
    {
        return match ($driver) {
            DefaultDrivers::CLAUDE_CODE => new self(
                $driver,
                $version,
                '5432918d904a9b6afef7bb79d20df24d76052eabc1f41bceb84091d21f8889a7',
                ['--strict-mcp-config', '--mcp-config', '--settings', '--tools'],
                [],
                AuthenticationArrangement::DirectProcesses,
                DriverEvidence::PrerequisiteMissing,
                'the signed-in procedure of docs/accounts/claude-native-evidence.md',
            ),
            DefaultDrivers::CODEX => new self(
                $driver,
                $version,
                'a45099154d7fb4a5ed8a56f40966a95deb938e508bab23e6985035c709e9a85a',
                ['app-server', '--add-dir'],
                ['cli_auth_credentials_store' => 'file'],
                AuthenticationArrangement::SharedOwner,
                DriverEvidence::PrerequisiteMissing,
                'the signed-in procedure of docs/accounts/codex-native-evidence.md',
            ),
            default => throw DriverFamilyUnknown::for($driver),
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
     * Refuses an account start whose way of sharing the sign-in the real driver has not shown.
     *
     * @throws DriverArrangementUnproven
     */
    public function assertStartable(): void
    {
        if (! $this->arrangementEvidence->isNativeShown()) {
            throw DriverArrangementUnproven::for(
                $this->driver,
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
