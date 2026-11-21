<?php

declare(strict_types=1);

namespace Domain\Sequences\States\Support;

use App\Hooks\Decisions\StateReferences;
use App\Hooks\Enums\SessionTransferType;
use App\Hooks\Exceptions\StateSubjectMissing;
use App\Hooks\References\StateReference;
use App\Hooks\References\SubjectReference;
use App\Hooks\StateLoading\Contracts\StateLoader;
use App\Hooks\StateLoading\StateSet;
use App\Hooks\States\AgentState;
use Domain\Sequences\Resolvers\Support\SequenceRecords;
use Domain\Sequences\States\FollowingSequenceState;

/**
 * Builds the following-sequence state from the run as it is now, on its current step; it keeps no run between calls.
 */
final readonly class FollowingSequenceStateFactory implements StateLoader
{
    public function __construct(private SequenceRecords $runs) {}

    public function stateClass(): string
    {
        return FollowingSequenceState::class;
    }

    public function statesFor(StateReferences $references): StateSet
    {
        $subjects = $this->runs->many($references->subjectIds());

        return StateSet::build($references, function (StateReference $reference) use ($subjects): AgentState {
            $subject = $reference->subject;

            if (! $subject instanceof SubjectReference || ! isset($subjects[$subject->id])) {
                throw StateSubjectMissing::for($reference->typeKey);
            }

            return new FollowingSequenceState($subjects[$subject->id]->work());
        });
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
