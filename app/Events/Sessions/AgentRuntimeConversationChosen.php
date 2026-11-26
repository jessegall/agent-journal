<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Sessions\Contracts\AgentRuntimeEvent;

/**
 * The journal chose the conversation every turn of a runtime it drives continues.
 */
final readonly class AgentRuntimeConversationChosen implements AgentRuntimeEvent, SessionEvent
{
    public function __construct(public string $runtimeId) {}
}
