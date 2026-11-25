<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\Sessions\StartDisposition;

/**
 * An agent's latest start: the start request it answers, where it stands, the session it started and the reason a
 * refusal kept. Its version is where it stands, so a dismissed outcome that moves on shows again.
 */
final readonly class SessionStartOutcome
{
    public function __construct(
        public string $agentId,
        public string $requestId,
        public StartDisposition $disposition,
        public string|null $sessionId,
        public string|null $refusalReason,
    ) {}

    /**
     * The key a viewer's dismissal of an outcome is kept under: its request id and version.
     */
    public static function keyOf(string $requestId, string $version): string
    {
        return "{$requestId}:{$version}";
    }

    public function version(): string
    {
        return $this->disposition->value;
    }

    public function key(): string
    {
        return self::keyOf($this->requestId, $this->version());
    }
}
