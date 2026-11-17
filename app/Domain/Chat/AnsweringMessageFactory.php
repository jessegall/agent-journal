<?php

declare(strict_types=1);

namespace App\Domain\Chat;

use App\Core\Hooks\Decisions\StateReference;
use App\Core\Hooks\Decisions\SubjectReference;
use App\Core\Hooks\States\AgentState;
use App\Core\Hooks\States\StateSubjectMissing;
use App\Core\Hooks\States\StateType;
use App\Domain\Chat\States\AnsweringMessage;

/**
 * Builds the answering-message state from the message as it is now; it keeps no message between calls.
 */
final readonly class AnsweringMessageFactory implements StateType
{
    public function __construct(private MessageRecords $messages) {}

    public function stateFor(StateReference $reference): AgentState
    {
        $subject = $reference->subject;

        if (! $subject instanceof SubjectReference) {
            throw StateSubjectMissing::for($reference);
        }

        try {
            $message = $this->messages->get($subject->id);
        } catch (MessageMissing $missing) {
            throw StateSubjectMissing::for($reference, $missing);
        }

        return new AnsweringMessage($message->work());
    }

    public function schemaVersion(): int
    {
        return 1;
    }
}
