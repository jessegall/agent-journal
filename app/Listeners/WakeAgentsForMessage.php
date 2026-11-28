<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Actors\AttentionOrigin;
use App\Actors\Contracts\ActorAttention;
use App\Attributes\Listeners\InCommandTransaction;
use App\Contracts\Events\Listener;
use App\Events\Messages\MessageSent;
use App\Models\Agents\Agent;
use App\Models\Inboxes\InboxMember;

/**
 * Asks every agent attached to the inbox but the sender for its attention, in the same transaction as the message, so
 * an idle agent wakes to read it; an agent that runs no session is not woken.
 */
#[InCommandTransaction]
final readonly class WakeAgentsForMessage implements Listener
{
    public function __construct(private ActorAttention $attention) {}

    public function handle(MessageSent $event): void
    {
        foreach (InboxMember::resolveAttachedTo([$event->inboxId], Agent::class) as $agent) {
            if (! $event->sender->isSameAs($agent)) {
                $this->attention->request($agent, AttentionOrigin::message($event->messageId));
            }
        }
    }
}
