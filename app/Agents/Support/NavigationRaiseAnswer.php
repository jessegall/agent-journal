<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Enums\NavigationRaiseOutcome;

/**
 * The journal's answer to a host's raise: what came of it, the navigation request it opened, and when a waiting host
 * asks again.
 */
final readonly class NavigationRaiseAnswer
{
    private function __construct(
        public NavigationRaiseOutcome $answer,
        public string|null $requestId,
        public int|null $retryAfterSeconds,
    ) {}

    public static function opened(string $requestId): self
    {
        return new self(NavigationRaiseOutcome::Opened, $requestId, null);
    }

    public static function held(): self
    {
        return new self(NavigationRaiseOutcome::Held, null, null);
    }

    public static function wait(int $retryAfterSeconds): self
    {
        return new self(NavigationRaiseOutcome::Wait, null, $retryAfterSeconds);
    }
}
