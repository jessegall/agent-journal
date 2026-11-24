<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Attributes\InCommandTransaction;
use App\Contracts\Events\Listener;
use App\Contracts\Work\AgentStack;
use App\Events\Messages\ChatMessageOffered;
use App\Support\States\Support\AnsweringMessageStateReference;

/**
 * Puts the answering state of the chat on the stack of the agent a message was sent to, in the same transaction as the
 * message, with that message waiting; a frame already there hears the offer itself and adds the message to its list.
 * An agent that runs no session gets nothing.
 */
#[InCommandTransaction]
final readonly class PushAnsweringMessageState implements Listener
{
    public function __construct(private AgentStack $stacks) {}

    public function handle(ChatMessageOffered $event): void
    {
        $this->stacks->pushFor($event->agent, AnsweringMessageStateReference::forOffer($event));
    }
}
