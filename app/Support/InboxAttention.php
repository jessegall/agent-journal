<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\ActorAttention;
use App\Contracts\Chat\Inbox;
use App\Contracts\Chat\InboxResolver;
use App\Models\Messages\MessageAttention;

/**
 * Asks every current member of an inbox to look, once per origin: the members are read once, the actors already
 * asked are read once, and each new member's runtime is woken in the caller's transaction.
 */
final readonly class InboxAttention
{
    public function __construct(
        private InboxResolver $inboxes,
        private ActorAttention $attention,
    ) {}

    public function requestFor(Inbox $inbox, AttentionOrigin $origin): void
    {
        $asked = MessageAttention::actorsAskedFor($origin);
        $attentions = [];

        foreach ($this->inboxes->membersOf($inbox) as $membership) {
            $actor = $membership->actor;

            if (in_array("{$actor->type->value}:{$actor->id}", $asked, true)) {
                continue;
            }

            $outcome = $this->attention->request($actor, $origin);
            $attentions[] = MessageAttention::unsaved($origin, $inbox->inboxId(), $actor, $outcome);
        }

        MessageAttention::createAll($attentions);
    }
}
