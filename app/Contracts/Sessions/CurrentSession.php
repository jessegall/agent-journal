<?php

declare(strict_types=1);

namespace App\Contracts\Sessions;

use App\Exceptions\AgentContextMissing;

/**
 * The journal session of the agent calling in this request.
 */
interface CurrentSession
{
    /**
     * Whether an agent calls in this request, so it has a session.
     */
    public function hasSession(): bool;

    /**
     * @throws AgentContextMissing when no agent calls in this request
     */
    public function sessionId(): string;
}
