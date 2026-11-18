<?php

declare(strict_types=1);

namespace App\Agents\Support;

/**
 * One request handed to a host: which runtime, which request and attempt, and what to do.
 */
final readonly class ClaimedRequest
{
    public function __construct(
        public string $runtimeId,
        public string $requestId,
        public int $sequence,
        public int $attempt,
        public string $operation,
        public string|null $message,
        public string|null $model,
        public string|null $effort,
    ) {}

}
