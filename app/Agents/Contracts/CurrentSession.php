<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Agents\Exceptions\AgentContextMissing;
use App\Agents\Support\RequestSession;
use Illuminate\Container\Attributes\Bind;

/**
 * The journal session of the agent calling in this request.
 */
#[Bind(RequestSession::class)]
interface CurrentSession
{
    /**
     * @throws AgentContextMissing when no agent calls in this request
     */
    public function sessionId(): string;
}
