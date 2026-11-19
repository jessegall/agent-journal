<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Ticks;

use App\Hooks\Contracts\WorkOccurrenceGuard;
use App\Hooks\Contracts\TickableStateLoader;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\Decisions\StateSet;
use App\Hooks\States\AgentState;

/**
 * A ticking state type that keeps the size of every batch it was asked to restore; subjects a test names are done.
 */
final class CountingTickingLoader implements TickableStateLoader
{
    /**
     * @var list<int>
     */
    public array $batchSizes = [];

    /**
     * @var list<string>
     */
    public array $finished = [];

    public ScriptedOccurrenceGuard $guard;

    public function __construct()
    {
        $this->guard = new ScriptedOccurrenceGuard();
    }

    public function statesFor(StateReferences $references): StateSet
    {
        $this->batchSizes[] = count($references->all);

        return StateSet::build(
            $references,
            fn (StateReference $reference): AgentState => TickingState::of($reference, $this->finished),
        );
    }

    public function schemaVersion(): int
    {
        return 1;
    }

    public function occurrenceGuard(): WorkOccurrenceGuard
    {
        return $this->guard;
    }
}
