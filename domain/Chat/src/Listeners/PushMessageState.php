<?php

declare(strict_types=1);

namespace Domain\Chat\Listeners;

use App\Hooks\Contracts\AgentStack;
use Domain\Chat\Events\MessageNeedsAnswer;
use Domain\Chat\Readers\MessageRecords;
use Domain\Chat\States\Support\AnsweringMessageStateReference;

/**
 * Puts the message that needs an answer on the agent's stack in the same transaction that asked for the answer.
 */
final readonly class PushMessageState
{
    public function __construct(
        private MessageRecords $messages,
        private AgentStack $stacks,
    ) {}

    public function handle(MessageNeedsAnswer $event): void
    {
        $this->stacks->push($event->target, AnsweringMessageStateReference::forMessage($this->messages->addressedTo($event->target, $event->messageId)));
    }
}
