<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\ExecutionModeType;
use App\Support\Stored\StoredAccessPolicy;
use App\Support\Stored\StoredExecutionPolicy;
use App\Support\Stored\StoredStopConditions;

/**
 * The policy a start runs under, frozen with the session it starts: what the agent may reach, when it may stop, how
 * it runs, the profile revision and configuration it came from, or none for a main start without a profile, and
 * whether its finished work must be reviewed before anything else may take its actor or checkout.
 */
final readonly class StartPolicy
{
    public function __construct(
        public AccessPolicy $access,
        public StopConditions $stopConditions,
        public ExecutionPolicy $execution,
        public string|null $profileKey,
        public int|null $profileRevision,
        public string|null $configurationHash,
        public bool $requiresReview = false,
    ) {}

    /**
     * A main agent started without a profile: its own host's rights, no stop conditions, the execution given.
     */
    public static function withoutProfile(ExecutionPolicy $execution): self
    {
        return new self(
            new AccessPolicy([], [], ProcessGrants::everything()),
            StopConditions::make([]),
            $execution,
            null,
            null,
            null,
        );
    }

    /**
     * A user's main agent started with an explicit driver and model and no profile: on the protected host, in
     * the given folder, with the default budgets.
     */
    public static function mainOnHost(string $worktree): self
    {
        return self::withoutProfile(
            ExecutionPolicy::make(ExecutionModeType::ProtectedHost, null, $worktree, ExecutionBudgets::defaults(), []),
        );
    }

    /**
     * The fingerprint of the whole policy, so two starts under the same policy can be told from changed ones.
     */
    public function digest(): string
    {
        return hash('sha256', json_encode([
            StoredAccessPolicy::fromAccessPolicy($this->access),
            StoredStopConditions::fromStopConditions($this->stopConditions),
            StoredExecutionPolicy::fromExecutionPolicy($this->execution),
            $this->profileKey,
            $this->profileRevision,
            $this->configurationHash,
            $this->requiresReview,
        ], JSON_THROW_ON_ERROR));
    }
}
