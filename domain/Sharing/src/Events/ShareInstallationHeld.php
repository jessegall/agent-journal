<?php

declare(strict_types=1);

namespace Domain\Sharing\Events;

/**
 * A share installation is held by a run.
 */
final readonly class ShareInstallationHeld implements ShareEvent
{
    public function __construct(
        public string $installationId,
        public string $runId,
    ) {}
}
