<?php

declare(strict_types=1);

namespace App\Support;

use App\Models\AgentRuntime;

/**
 * The part of a runtime's screen identity its registration decides, whatever pixels arrive: the runtime, the host
 * that runs it and its process generation.
 */
final readonly class ScreenRegistration
{
    public function __construct(
        public string $runtimeId,
        public string $hostId,
        public int $processGeneration,
    ) {}

    public static function of(AgentRuntime $runtime): self
    {
        return new self($runtime->id, $runtime->host_id, $runtime->process_generation);
    }

    /**
     * Whether both name the same runtime on the same host at the same process generation.
     */
    public function isSameAs(self $other): bool
    {
        return $this->runtimeId === $other->runtimeId
            && $this->hostId === $other->hostId
            && $this->processGeneration === $other->processGeneration;
    }
}
