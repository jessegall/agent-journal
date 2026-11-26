<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Stacks;

use App\Stacks\AgentState;
use App\Stacks\Contracts\Work\UniqueSubjectState;
use App\Support\RecordIdentity;
use Tests\Fixtures\Hooks\SubjectIds;

/**
 * A state about one subject that is finished once the test has finished that subject.
 */
final class FinishableState extends AgentState implements UniqueSubjectState
{
    public function __construct(private readonly string $subject, private readonly FinishedSubjects $hasFinished) {}

    public function stateSubject(): RecordIdentity
    {
        return new RecordIdentity('tests.subject', SubjectIds::of($this->subject));
    }

    public function isFinished(): bool
    {
        return $this->hasFinished->has($this->subject);
    }
}
