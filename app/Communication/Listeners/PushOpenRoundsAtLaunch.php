<?php

declare(strict_types=1);

namespace App\Communication\Listeners;

use App\Communication\Resolvers\MessageRecords;
use App\Communication\States\Support\AnsweringMessageStateReference;
use App\Contracts\Listener;
use App\Hooks\Contracts\AgentStack;
use App\Hooks\Enums\ContextStartType;
use App\Hooks\Events\ContextStarted;

/**
 * A message addressed to an actor that ran no session waits for its next launch: the new session's stack gets the
 * answering frame of every open round then.
 */
final readonly class PushOpenRoundsAtLaunch implements Listener
{
    public function __construct(private MessageRecords $messages, private AgentStack $stacks) {}

    public function handle(ContextStarted $event): void
    {
        if ($event->type !== ContextStartType::Launch) {
            return;
        }

        foreach ($this->messages->openRoundsFor($event->target->actorIdentity()) as $message) {
            $this->stacks->push($event->target, AnsweringMessageStateReference::forRound($message->id, $message->answer_round));
        }
    }
}
