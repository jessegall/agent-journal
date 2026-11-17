<?php

declare(strict_types=1);

namespace App\Domain\Chat\States\Support;

use App\Core\Hooks\Contracts\StateType;
use App\Core\Hooks\Decisions\StateReference;
use App\Core\Hooks\Decisions\SubjectReference;
use App\Core\Hooks\Exceptions\StateSubjectMissing;
use App\Core\Hooks\States\AgentState;
use App\Domain\Chat\Exceptions\MessageMissing;
use App\Domain\Chat\Readers\MessageRecords;
use App\Domain\Chat\States\AnsweringMessageState;

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
