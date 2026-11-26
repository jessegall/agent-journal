<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Sessions\Contracts\AgentRuntimeEvent;

/**
 * The runtime's build and its account's sign-in were proven, so its turns may open.
 */
final readonly class AgentRuntimeStartProven implements AgentRuntimeEvent, SessionEvent
{
    public function __construct(public string $runtimeId) {}
}
