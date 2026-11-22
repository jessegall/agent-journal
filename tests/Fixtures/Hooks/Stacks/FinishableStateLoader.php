<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Stacks;

use App\Support\Decisions\StateReferences;
use App\Enums\NoSubject;
use App\Enums\SessionTransferType;
use App\Support\References\StateReference;
use App\Support\StateLoading\Contracts\StateLoader;
use App\Support\StateLoading\StateSet;
use App\Support\States\AgentState;

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
