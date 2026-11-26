<?php

declare(strict_types=1);

namespace App\Events\Processes;

use App\Processes\Contracts\EvidencePermitEvent;

/**
 * An evidence permit was used by a run.
 */
final readonly class EvidencePermitConsumed implements EvidencePermitEvent, ProcessEvent
{
    public function __construct(
        public string $permitId,
        public string $runId,
    ) {}
}
