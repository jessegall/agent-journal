<?php

declare(strict_types=1);

namespace App\Communication\States\Support;

use App\Communication\Resolvers\MessageRecords;
use App\Communication\States\AnsweringMessageState;
use App\Hooks\Contracts\StateLoader;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\Decisions\StateSet;
use App\Hooks\Decisions\SubjectReference;
use App\Hooks\Exceptions\StateSubjectMissing;
use App\Hooks\States\AgentState;

/**
 * Builds the answering-message state from the message as it is now; it keeps no message between calls.
 */
final readonly class AnsweringMessageStateFactory implements StateLoader
{
    public function __construct(private MessageRecords $messages) {}

    public function statesFor(StateReferences $references): StateSet
    {
        $subjects = $this->messages->many($references->subjectIds());

        return StateSet::build($references, function (StateReference $reference) use ($subjects): AgentState {
            $subject = $reference->subject;

            if (! $subject instanceof SubjectReference || ! isset($subjects[$subject->id])) {
                throw StateSubjectMissing::for($reference->typeKey);
            }

            return new AnsweringMessageState($subjects[$subject->id]->workIn($subject->runNumber));
        });
    }

    public function schemaVersion(): int
    {
        return 1;
    }
}
