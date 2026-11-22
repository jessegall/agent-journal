<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Processes\StopPreparer;
use App\Values\StopPreparation;
use App\Values\StopPreparationRequest;

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
