<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Contracts\Drivers\CallingDriver;
use App\Contracts\Sessions\CurrentSession;
use App\Models\Agents\AgentSession;

/**
 * Reads the calling session's driver from its own row.
 */
final readonly class CallingSessionDriver implements CallingDriver
{
    public function __construct(private CurrentSession $sessions) {}

    public function driverKey(): string|null
    {
        if (! $this->sessions->hasSession()) {
            return null;
        }

        return AgentSession::query()->findOrFail($this->sessions->sessionId())->driver_key;
    }
}
