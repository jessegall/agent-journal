<?php

declare(strict_types=1);

namespace App\Agents\Resolvers;

use App\Agents\Contracts\CallingProgram;
use App\Agents\Contracts\CurrentSession;
use App\Agents\Models\AgentSession;

/**
 * Reads the calling session's program from its own row.
 */
final readonly class CallingSessionProgram implements CallingProgram
{
    public function __construct(private CurrentSession $sessions) {}

    public function programKey(): string|null
    {
        if (! $this->sessions->hasSession()) {
            return null;
        }

        return AgentSession::query()->findOrFail($this->sessions->sessionId())->program;
    }
}
