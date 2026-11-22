<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Contracts\CurrentSession;

/**
 * The calling agent's session for a test that runs outside an agent request.
 */
final readonly class FixedSession implements CurrentSession
{
    public function __construct(private string $sessionId) {}

    public function hasSession(): bool
    {
        return true;
    }

    public function sessionId(): string
    {
        return $this->sessionId;
    }
}
