<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Ticks;

use App\Hooks\Contracts\StateLoader;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\Decisions\StateSet;
use LogicException;

/**
 * A state type that does not tick and must never be restored while the engine selects ticks.
 */
final class UnreadLoader implements StateLoader
{
    public function statesFor(StateReferences $references): StateSet
    {
        throw new LogicException('A state type that does not tick was restored.');
    }

    public function schemaVersion(): int
    {
        return 1;
    }
}
