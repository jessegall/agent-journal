<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Agents\Exceptions\AgentContextMissing;

/**
 * The journal session of the agent calling in this request.
 */
interface CurrentSession
{
    /**
     * @throws AgentContextMissing when no agent calls in this request
     */
    public function sessionId(): string;
}
