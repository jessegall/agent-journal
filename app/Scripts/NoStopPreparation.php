<?php

declare(strict_types=1);

namespace App\Scripts;

use App\Processes\Contracts\StopPreparer;
use App\Processes\Values\StopPreparation;
use App\Processes\Values\StopPreparationRequest;

/**
 * Without scripts a stop needs no preparation and goes straight to its final checks.
 */
final readonly class NoStopPreparation implements StopPreparer
{
    public function prepare(StopPreparationRequest $request): StopPreparation
    {
        return StopPreparation::finalChecks();
    }
}
