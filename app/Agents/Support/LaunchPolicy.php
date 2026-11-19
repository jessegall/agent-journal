<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Values\AccessPolicy;
use App\Agents\Values\StopConditions;
use App\Processes\Values\ProcessGrants;

/**
 * The policy a launch runs under, frozen with the session it starts: what the agent may reach, when it may stop, how
 * it runs, and the profile revision and configuration it came from, or none for a main launch without a profile.
 */
final readonly class LaunchPolicy
{
    public function __construct(
        public AccessPolicy $access,
        public StopConditions $stopConditions,
        public ExecutionPolicy $execution,
        public string|null $profileKey,
        public int|null $profileRevision,
        public string|null $configurationHash,
    ) {}

    /**
     * A main agent launched without a profile: its own host's rights, no stop conditions, the execution given.
     */
    public static function withoutProfile(ExecutionPolicy $execution): self
    {
        return new self(
            AccessPolicy::make([], [], [], [], [], ProcessGrants::everything()),
            StopConditions::make([]),
            $execution,
            null,
            null,
            null,
        );
    }

    /**
     * The fingerprint of the whole policy, so two launches under the same policy can be told from changed ones.
     */
    public function digest(): string
    {
        return hash('sha256', json_encode([
            StoredPolicies::accessToArray($this->access),
            StoredPolicies::stopConditionsToArray($this->stopConditions),
            StoredPolicies::executionToArray($this->execution),
            $this->profileKey,
            $this->profileRevision,
            $this->configurationHash,
        ], JSON_THROW_ON_ERROR));
    }
}
