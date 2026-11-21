<?php

declare(strict_types=1);

namespace App\Agents\Resolvers;

use App\Agents\Contracts\CallingDriver;
use App\Agents\Contracts\CurrentSession;
use App\Agents\Models\AgentSession;

/**
 * Reads the calling session's program from its own row.
 */
final readonly class CallingSessionDriver implements CallingDriver
{
    public function __construct(private CurrentSession $sessions) {}

    public function driverKey(): string|null
    {
        if (! $this->sessions->hasSession()) {
            return null;
        }

        return AgentSession::query()->findOrFail($this->sessions->sessionId())->driver;
    }
}
