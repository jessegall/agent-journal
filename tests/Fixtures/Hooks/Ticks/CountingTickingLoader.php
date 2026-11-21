<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Ticks;

use App\Hooks\StateLoading\Contracts\TickableStateLoader;
use App\Hooks\Contracts\WorkOccurrenceGuard;
use App\Hooks\References\StateReference;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\StateLoading\StateSet;
use App\Hooks\Enums\SessionTransferType;
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

    public function stateClass(): string
    {
        return TickingState::class;
    }

    public function statesFor(StateReferences $references): StateSet
    {
        $this->batchSizes[] = count($references->references);

        return StateSet::build(
            $references,
            fn (StateReference $reference): AgentState => TickingState::of($reference, $this->finished),
        );
    }

    public function schemaVersion(): int
    {
        return 1;
    }

    public function sessionTransfer(): SessionTransferType
    {
        return SessionTransferType::SessionOnly;
    }

    public function occurrenceGuard(): WorkOccurrenceGuard
    {
        return $this->guard;
    }
}
