<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Agents\Contracts\CurrentSession;

/**
 * The calling agent's session for a test that runs outside an agent request.
 */
final readonly class FixedSession implements CurrentSession
{
    public function __construct(private string $sessionId, private bool $mainAgent = true) {}

    public function sessionId(): string
    {
        return $this->sessionId;
    }

    public function isMainAgent(): bool
    {
        return $this->mainAgent;
    }
}
