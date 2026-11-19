<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Ticks;

use Tests\Support\Exceptions\SimulatedFailure;
use App\Hooks\Contracts\StateLoader;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\Decisions\StateSet;

/**
 * A state type that does not tick and must never be restored while the engine selects ticks.
 */
final class UnreadLoader implements StateLoader
{
    public function statesFor(StateReferences $references): StateSet
    {
        throw SimulatedFailure::of('A state type that does not tick was restored.');
    }

    public function schemaVersion(): int
    {
        return 1;
    }
}
