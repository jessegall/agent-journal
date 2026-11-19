<?php

declare(strict_types=1);

namespace App\Agents\Support;

/**
 * The secrets the host needs for one accepted start: its token and its isolated settings.
 */
final readonly class StartMaterial
{
    public function __construct(
        public string $sessionId,
        public string $token,
        public string $settings,
    ) {}
}
