<?php

declare(strict_types=1);

namespace App\Hooks\Support;

use App\Hooks\Contracts\StopPreparer;
use App\Hooks\Values\StopPreparation;
use App\Hooks\Values\StopPreparationRequest;

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
