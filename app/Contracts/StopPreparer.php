<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Values\StopPreparation;
use App\Values\StopPreparationRequest;

/**
 * Prepares a stop before its final checks run, such as by the profile's STOP script.
 */
interface StopPreparer
{
    public function prepare(StopPreparationRequest $request): StopPreparation;
}
