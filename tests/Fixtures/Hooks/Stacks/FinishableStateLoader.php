<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Stacks;

use App\Hooks\Decisions\StateReferences;
use App\Hooks\Enums\NoSubject;
use App\Hooks\Enums\SessionTransferType;
use App\Hooks\References\StateReference;
use App\Hooks\StateLoading\Contracts\StateLoader;
use App\Hooks\StateLoading\StateSet;
use App\Hooks\States\AgentState;

/**
 * A fixture state type whose states are finished once a test names their subject.
 */
final class FinishableStateLoader implements StateLoader
{
    /**
     * @var list<string> subjects whose work is done
     */
    public array $finished = [];

    public function stateClass(): string
    {
        return FinishableState::class;
    }

    public function statesFor(StateReferences $references): StateSet
    {
        return StateSet::build($references, fn (StateReference $reference): AgentState => new FinishableState(
            $reference->subject !== NoSubject::None && in_array($reference->subject->id, $this->finished, true),
        ));
    }

    public function schemaVersion(): int
    {
        return 1;
    }

    public function sessionTransfer(): SessionTransferType
    {
        return SessionTransferType::SessionOnly;
    }
}
