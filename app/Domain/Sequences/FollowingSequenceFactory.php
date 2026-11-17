<?php

declare(strict_types=1);

namespace App\Domain\Sequences;

use App\Core\Hooks\Decisions\StateReference;
use App\Core\Hooks\Decisions\SubjectReference;
use App\Core\Hooks\Exceptions\StateSubjectMissing;
use App\Core\Hooks\States\AgentState;
use App\Core\Hooks\States\StateType;
use App\Domain\Sequences\Exceptions\SequenceRunMissing;
use App\Domain\Sequences\States\FollowingSequence;

/**
 * Builds the following-sequence state from the run as it is now, on its current step; it keeps no run between calls.
 */
final readonly class FollowingSequenceFactory implements StateType
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

        return new FollowingSequence($run->work());
    }

    public function schemaVersion(): int
    {
        return 1;
    }
}
