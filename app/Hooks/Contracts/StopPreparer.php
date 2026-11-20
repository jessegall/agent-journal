<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

use App\Hooks\Values\StopPreparation;
use App\Hooks\Values\StopPreparationRequest;

/**
 * Prepares a stop before its final checks run, such as by the profile's STOP script.
 */
interface StopPreparer
{
    public function prepare(StopPreparationRequest $request): StopPreparation;
}
