<?php

declare(strict_types=1);

namespace App\Contracts\Processes;

use App\Values\StopPreparation;
use App\Values\StopPreparationRequest;

/**
 * Prepares a stop before its final checks run, such as by the profile's STOP script.
 */
interface StopPreparer
{
    /**
     * What must happen before a stop as the request asks, such as saving the agent's work.
     */
    public function prepare(StopPreparationRequest $request): StopPreparation;
}
