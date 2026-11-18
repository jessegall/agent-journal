<?php

declare(strict_types=1);

namespace Domain\Chat\States\Support;

use App\Hooks\Contracts\StateType;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\SubjectReference;
use App\Hooks\Exceptions\StateSubjectMissing;
use App\Hooks\States\AgentState;
use Domain\Chat\Exceptions\MessageMissing;
use Domain\Chat\Readers\MessageRecords;
use Domain\Chat\States\AnsweringMessageState;

/**
 * Builds the answering-message state from the message as it is now; it keeps no message between calls.
 */
final readonly class AnsweringMessageStateFactory implements StateType
{
    public function __construct(private MessageRecords $messages) {}

    public function stateFor(StateReference $reference): AgentState
    {
        $subject = $reference->subject;

        if (! $subject instanceof SubjectReference) {
            throw StateSubjectMissing::for($reference->typeKey);
        }

        try {
            $message = $this->messages->get($subject->id);
        } catch (MessageMissing $missing) {
            throw StateSubjectMissing::for($reference->typeKey, $missing);
        }

        return new AnsweringMessageState($message->work());
    }

    public function schemaVersion(): int
    {
        return 1;
    }
}
