<?php

declare(strict_types=1);

namespace App\Domain\Chat\Listeners;

use App\Core\Hooks\Contracts\AgentStack;
use App\Domain\Chat\AnsweringMessageStateReference;
use App\Domain\Chat\Events\MessageNeedsAnswer;
use App\Domain\Chat\MessageRecords;

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
