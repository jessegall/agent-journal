<?php

declare(strict_types=1);

namespace Domain\Sequences\States\Support;

use App\Hooks\Contracts\StateType;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\SubjectReference;
use App\Hooks\Exceptions\StateSubjectMissing;
use App\Hooks\States\AgentState;
use Domain\Sequences\Exceptions\SequenceRunMissing;
use Domain\Sequences\Readers\Support\SequenceRecords;
use Domain\Sequences\States\FollowingSequenceState;

/**
 * Builds the following-sequence state from the run as it is now, on its current step; it keeps no run between calls.
 */
final readonly class FollowingSequenceStateFactory implements StateType
{
    public function __construct(private SequenceRecords $runs) {}

    public function stateFor(StateReference $reference): AgentState
    {
        $subject = $reference->subject;

        if (! $subject instanceof SubjectReference) {
            throw StateSubjectMissing::for($reference->typeKey);
        }

        try {
            $run = $this->runs->get($subject->id);
        } catch (SequenceRunMissing $missing) {
            throw StateSubjectMissing::for($reference->typeKey, $missing);
        }

        return new FollowingSequenceState($run->work());
    }

    public function schemaVersion(): int
    {
        return 1;
    }
}
