<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

use App\Hooks\Values\StopAttemptReference;
use App\Hooks\Values\StopAttemptResult;

/**
 * What the host's results say about one stop attempt of the current session, as the ready bottoms read it; it never
 * runs a command.
 */
interface StopEvidence
{
    public function result(StopAttemptReference $attempt): StopAttemptResult;
}
