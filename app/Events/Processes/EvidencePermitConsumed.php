<?php

declare(strict_types=1);

namespace App\Events\Processes;

use App\Contracts\Processes\EvidencePermitEvent;

/**
 * An evidence permit was used by a run.
 */
final readonly class EvidencePermitConsumed extends ProcessEvent implements EvidencePermitEvent
{
    public function __construct(
        public string $permitId,
        public string $runId,
    ) {}
}
