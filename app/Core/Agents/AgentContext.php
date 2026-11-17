<?php

declare(strict_types=1);

namespace App\Core\Agents;

/**
 * Who is calling in this request: the agent, its journal session and role, and the signed call. It lives for one request only.
 */
final readonly class AgentContext
{
    public function __construct(
        public int $agentId,
        public int $sessionId,
        public string $role,
        public SignedCall $call,
    ) {}
}
