<?php

declare(strict_types=1);

namespace Domain\Chat\Support\States\Support;

use App\Enums\SessionTransferType;
use App\Exceptions\StateSubjectMissing;
use App\Support\Decisions\StateReferences;
use App\Support\References\StateReference;
use App\Support\References\SubjectReference;
use App\Support\StateLoading\Contracts\StateLoader;
use App\Support\StateLoading\StateSet;
use App\Values\AnswerBudget;
use Domain\Chat\Support\States\AnsweringChatState;

/**
 * Builds the answering state of the chat its frame names. It reads nothing: which messages wait and how many tool
 * uses were made come back from the frame itself.
 */
final readonly class AnsweringChatStateFactory implements StateLoader
{
    public function __construct(private AnswerBudget $budget) {}

    public function stateClass(): string
    {
        return AnsweringChatState::class;
    }

    public function statesFor(StateReferences $references): StateSet
    {
        return StateSet::build(
            $references,
            fn (StateReference $reference) => new AnsweringChatState($this->chatOf($reference), $this->budget),
        );
    }

    private function chatOf(StateReference $reference): string
    {
        $subject = $reference->subject;

        if (! $subject instanceof SubjectReference) {
            throw StateSubjectMissing::for($reference->typeKey);
        }

        return $subject->id;
    }

    public function schemaVersion(): int
    {
        return 1;
    }

    /**
     * The messages still wait in the session that continues the agent's work.
     */
    public function sessionTransfer(): SessionTransferType
    {
        return SessionTransferType::Durable;
    }
}
