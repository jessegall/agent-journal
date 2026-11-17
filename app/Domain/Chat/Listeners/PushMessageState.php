<?php

declare(strict_types=1);

namespace App\Domain\Chat\Listeners;

use App\Domain\Chat\AnsweringMessageReference;
use App\Domain\Chat\Events\MessageNeedsAnswer;
use App\Domain\Chat\MessageRecords;
use App\Domain\Hooks\AgentStacks;

/**
 * Puts the message that needs an answer on the agent's stack in the same transaction that asked for the answer.
 */
final readonly class PushMessageState
{
    public function __construct(
        private MessageRecords $messages,
        private AgentStacks $stacks,
    ) {}

    public function handle(MessageNeedsAnswer $event): void
    {
        $this->stacks->push($event->target, AnsweringMessageReference::forMessage($this->messages->addressedTo($event->target, $event->messageId)));
    }
}
