<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Sessions\Contracts\AgentRuntimeEvent;

/**
 * The runtime moved on to its next process generation.
 */
final readonly class AgentRuntimeProcessGenerationAdvanced implements AgentRuntimeEvent, SessionEvent
{
    public function __construct(public string $runtimeId, public int $generation) {}
}
