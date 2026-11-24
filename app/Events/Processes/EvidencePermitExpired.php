<?php

declare(strict_types=1);

namespace App\Events\Processes;

use App\Contracts\Processes\EvidencePermitEvent;

/**
 * An evidence permit expired unused.
 */
final readonly class EvidencePermitExpired extends ProcessEvent implements EvidencePermitEvent
{
    public function __construct(
        public string $permitId,
    ) {}
}
