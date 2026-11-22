<?php

declare(strict_types=1);

namespace App\Values;

/**
 * A renewed execution lease: the runtime and its generation, the server's time and the absolute time the lease
 * ends, in ISO 8601.
 */
final readonly class RuntimeLease
{
    /**
     * How long one renewal lets a runtime work.
     */
    public const int SECONDS = 60;

    public function __construct(
        public string $runtimeId,
        public int $generation,
        public string $serverTime,
        public string $expiresAt,
    ) {}
}
