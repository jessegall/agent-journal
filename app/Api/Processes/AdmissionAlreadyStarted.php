<?php

declare(strict_types=1);

namespace App\Api\Processes;

use App\Enums\Processes\AdmissionStatus;
use Spatie\LaravelData\Attributes\MapName;

/**
 * An admitted run another request already started, so this one starts nothing.
 */
final class AdmissionAlreadyStarted extends AdmissionFetched
{
    public function __construct(
        #[MapName('run_id')]
        public readonly string $runId,
    ) {
        $this->status = AdmissionStatus::AlreadyStarted;
    }
}
