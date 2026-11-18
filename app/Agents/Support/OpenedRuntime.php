<?php

declare(strict_types=1);

namespace App\Agents\Support;

/**
 * A runtime just opened: its session, the runtime row and the first delivery request, if one was asked for.
 */
final readonly class OpenedRuntime
{
    public function __construct(
        public string $sessionId,
        public string $runtimeId,
        public string|null $firstRequestId,
    ) {}
}
