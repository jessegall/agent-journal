<?php

declare(strict_types=1);

namespace App\Sessions\Values;

use App\Support\Inputs\Values\HookIdentity;

/**
 * One stop of an agent's session, by the id of its stop hook call: what a stop check is kept under.
 */
final readonly class StopIdentity
{
    public function __construct(
        public string $agentId,
        public string $sessionId,
        public string $stopId,
    ) {}

    public static function ofHook(HookIdentity $hook): self
    {
        return new self($hook->agentId, $hook->sessionId, $hook->hookId);
    }
}
