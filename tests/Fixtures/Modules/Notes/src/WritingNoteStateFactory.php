<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes;

use App\Hooks\StateLoading\Contracts\StateLoader;
use App\Hooks\References\StateReference;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\StateLoading\StateSet;
use App\Hooks\Enums\SessionTransferType;
use App\Hooks\States\AgentState;

/**
 * The state of a module installed outside the domain folder: while the agent writes a note, it may not stop.
 */
final class WritingNoteStateFactory implements StateLoader
{
    public function stateClass(): string
    {
        return WritingNoteState::class;
    }

    public function statesFor(StateReferences $references): StateSet
    {
        return StateSet::build($references, fn (StateReference $reference) => $this->stateFor($reference));
    }

    private function stateFor(StateReference $reference): AgentState
    {
        return new WritingNoteState();
    }

    public function schemaVersion(): int
    {
        return 1;
    }

    public function sessionTransfer(): SessionTransferType
    {
        return SessionTransferType::Durable;
    }
}
