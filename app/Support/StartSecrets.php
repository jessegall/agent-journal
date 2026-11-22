<?php

declare(strict_types=1);

namespace App\Support;

/**
 * The secrets the host needs for one accepted start: its token and its isolated settings.
 */
final readonly class StartSecrets
{
    public function __construct(
        public string $sessionId,
        public string $token,
        public string $settings,
    ) {}
}
