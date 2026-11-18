<?php

declare(strict_types=1);

namespace Domain\Sequences\States\Support;

use App\Hooks\Contracts\StateType;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\Decisions\StateSet;
use App\Hooks\Decisions\SubjectReference;
use App\Hooks\Exceptions\StateSubjectMissing;
use App\Hooks\States\AgentState;
use Domain\Sequences\Readers\Support\SequenceRecords;
use Domain\Sequences\States\FollowingSequenceState;

/**
 * Builds the following-sequence state from the run as it is now, on its current step; it keeps no run between calls.
 */
final readonly class FollowingSequenceStateFactory implements StateType
{
    public function __construct(private SequenceRecords $runs) {}

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
}
