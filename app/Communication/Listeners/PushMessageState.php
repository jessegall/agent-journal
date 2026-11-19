<?php

declare(strict_types=1);

namespace App\Communication\Listeners;

use App\Communication\Events\MessageNeedsAnswer;
use App\Communication\Resolvers\MessageRecords;
use App\Communication\States\Support\AnsweringMessageStateReference;
use App\Contracts\Listener;
use App\Hooks\Contracts\AgentStack;

/**
 * Puts the message that needs an answer on the agent's stack in the same transaction that asked for the answer.
 */
final readonly class PushMessageState implements Listener
{
    public function __construct(
        private MessageRecords $messages,
        private AgentStack $stacks,
    ) {}

    public function handle(MessageNeedsAnswer $event): void
    {
        $message = $this->messages->addressedTo($event->target, $event->messageId);
        $this->stacks->push($event->target, AnsweringMessageStateReference::forRound($message->id, $event->round));
    }
}
