<?php

declare(strict_types=1);

namespace App\Contracts\Processes;

use App\Values\StopCheckReference;
use App\Values\StopCheckResult;

/**
 * What the host's results say about one stop attempt of the current session, as the ready bottoms read it; it never
 * runs a command.
 */
interface StopEvidence
{
    /**
     * What the stop attempt found: whether the process ended, and how it was seen.
     */
    public function result(StopCheckReference $attempt): StopCheckResult;
}
