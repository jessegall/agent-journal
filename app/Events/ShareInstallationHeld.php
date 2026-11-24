<?php

declare(strict_types=1);

namespace App\Events;

/**
 * A share installation is held by a run.
 */
final readonly class ShareInstallationHeld extends ShareEvent
{
    public function __construct(
        public string $installationId,
        public string $runId,
    ) {}
}
