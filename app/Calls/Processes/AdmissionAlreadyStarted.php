<?php

declare(strict_types=1);

namespace App\Calls\Processes;

use App\Enums\Processes\AdmissionState;
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
        $this->state = AdmissionState::AlreadyStarted;
    }
}
