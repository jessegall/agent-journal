<?php

declare(strict_types=1);

namespace Domain\Documents\Listeners;

use App\Contracts\Agents\AgentNotices;
use App\Contracts\Events\Listener;
use App\Support\ActorIdentity;
use Domain\Documents\Events\DraftKept;

final readonly class NoticeDraftKept implements Listener
{
    public function __construct(private AgentNotices $notices) {}

    public function handle(DraftKept $event): void
    {
        if ($event->parent === null || ! ActorIdentity::of($event->parent)->isAgent()) {
            return;
        }

        $this->notices->notify(
            $event->parent->actorId(),
            "An unpublished draft of document {$event->documentId} was kept. "
                ."Read draft {$event->draftId} to recover it.",
            'draft-kept-'.$event->draftId,
        );
    }
}
