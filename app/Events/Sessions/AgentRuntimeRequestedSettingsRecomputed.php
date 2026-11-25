<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Sessions\AgentRuntimeEvent;

/**
 * A runtime's requested model and effort were worked out again from its open setting requests.
 */
final readonly class AgentRuntimeRequestedSettingsRecomputed implements AgentRuntimeEvent, SessionEvent
{
    public function __construct(
        public string $runtimeId,
    ) {}
}
