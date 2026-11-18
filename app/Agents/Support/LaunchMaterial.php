<?php

declare(strict_types=1);

namespace App\Agents\Support;

/**
 * The secrets of one accepted launch the host starts it with: its token and its isolated settings.
 */
final readonly class LaunchMaterial
{
    public function __construct(
        public string $sessionId,
        public string $token,
        public string $settings,
    ) {}
}
