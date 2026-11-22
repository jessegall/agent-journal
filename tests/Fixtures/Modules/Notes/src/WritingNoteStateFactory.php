<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes;

use App\Support\StateLoading\Contracts\StateLoader;
use App\Support\References\StateReference;
use App\Support\Decisions\StateReferences;
use App\Support\StateLoading\StateSet;
use App\Enums\SessionTransferType;
use App\Support\States\AgentState;

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
