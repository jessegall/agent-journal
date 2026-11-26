<?php

declare(strict_types=1);

namespace Domain\Chat\Events;

use App\Contracts\Events\InboxScopedFact;
use App\Navigation\Contracts\ClientUpdate;

/**
 * A source docked in a chat changed. Raised after the commit; the members of that chat read its dock again.
 */
final readonly class DockedSourceChanged implements ChatEvent, ClientUpdate, InboxScopedFact
{
    public function __construct(public string $inboxId) {}

    public function scopedInboxId(): string
    {
        return $this->inboxId;
    }
}
