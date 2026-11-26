<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Agents\Drivers\Contracts\CallingDriver as CallingDriverContract;
use App\Models\Agents\AgentSession;
use App\Sessions\Contracts\CurrentSession;

/**
 * Reads the calling session's driver from its own row.
 */
final readonly class CallingDriver implements CallingDriverContract
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
