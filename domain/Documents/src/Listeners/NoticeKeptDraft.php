<?php

declare(strict_types=1);

namespace Domain\Documents\Listeners;

use App\Communication\Contracts\InboxNotices;
use App\Contracts\Listener;
use Domain\Documents\Api\Events\DraftKept;

final readonly class NoticeKeptDraft implements Listener
{
    public function __construct(private InboxNotices $notices) {}

    public function handle(DraftKept $event): void
    {
        $this->notices->sendFromJournal(
            $event->parent,
            "An unpublished draft of document {$event->documentId} was kept. "
                ."Read draft {$event->draftId} to recover it.",
            'draft-kept-'.$event->draftId,
        );
    }
}
