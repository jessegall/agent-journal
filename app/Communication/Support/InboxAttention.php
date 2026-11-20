<?php

declare(strict_types=1);

namespace App\Communication\Support;

use App\Actors\Contracts\ActorAttention;
use App\Actors\Support\AttentionOrigin;
use App\Communication\Contracts\Inbox;
use App\Communication\Contracts\InboxResolver;
use App\Communication\Models\MessageAttention;

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

        foreach ($this->inboxes->membersOf($inbox) as $membership) {
            $actor = $membership->actor;

            if (in_array("{$actor->type->value}:{$actor->id}", $asked, true)) {
                continue;
            }

            MessageAttention::create($origin, $inbox->inboxId(), $actor, $this->attention->request($actor, $origin));
        }
    }
}
