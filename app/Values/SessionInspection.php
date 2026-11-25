<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\ExecutionModeType;
use App\Models\Starts\SessionPolicy;

/**
 * What a session runs under, as an inspector shows it: the profile revision and configuration it was frozen from,
 * where and how long it may run, its stop conditions and the results of its last settled stop. It holds no secret,
 * credential or host path.
 */
final readonly class SessionInspection
{
    /**
     * @param  list<string>  $stopConditions
     * @param  list<StopResultLine>  $lastStop
     */
    public function __construct(
        public string|null $profileKey,
        public int|null $profileRevision,
        public string|null $configurationHash,
        public ExecutionModeType $executionMode,
        public string|null $imageReference,
        public int $wallSeconds,
        public array $stopConditions,
        public array $lastStop,
    ) {}

    /**
     * The inspection of a session's frozen policy with the results of its last stop.
     *
     * @param  list<StopResultLine>  $lastStop
     */
    public static function of(SessionPolicy $policy, array $lastStop): self
    {
        $execution = $policy->execution_policy;

        return new self(
            $policy->profile_key,
            $policy->profile_revision,
            $policy->configuration_hash,
            $execution->mode,
            $execution->imageReference,
            $execution->budgets->wallSeconds,
            array_values($policy->stopConditionLabels()),
            $lastStop,
        );
    }
}
