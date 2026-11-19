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
