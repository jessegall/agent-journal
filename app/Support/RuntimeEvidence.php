<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\HoldReason;
use App\Enums\RuntimeActivity;
use App\Models\AgentRuntime;
use Carbon\CarbonImmutable;

/**
 * What the host last reported of a session's runtime: its activity and hold, whether that report is still fresh, how
 * old it is and the process generation it belongs to. A late report of an older generation is never stored on it.
 */
final readonly class RuntimeEvidence
{
    public function __construct(
        public RuntimeActivity $activity,
        public HoldReason $hold,
        public bool $isStale,
        public int|null $observationAgeSeconds,
        public int $generation,
    ) {}

    public static function of(AgentRuntime $runtime, CarbonImmutable $now): self
    {
        return new self(
            $runtime->activity,
            $runtime->hold_reason,
            $runtime->isStale($now),
            $runtime->observationAge($now),
            $runtime->process_generation,
        );
    }

    /**
     * Whether the report can be trusted to say what the process does now.
     */
    public function isFresh(): bool
    {
        return ! $this->isStale && $this->activity !== RuntimeActivity::HostUnavailable;
    }
}
