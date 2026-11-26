<?php

declare(strict_types=1);

namespace App\Projects\Values;

/**
 * A started device grant: its nonsecret reference and generation, the code the owner checks and when it expires, in
 * ISO 8601.
 */
final readonly class DeviceGrantStart
{
    public function __construct(
        public string $reference,
        public int $generation,
        public string $userCode,
        public string $expiresAt,
    ) {}
}
