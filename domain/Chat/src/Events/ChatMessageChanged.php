<?php

declare(strict_types=1);

namespace Domain\Chat\Events;

use App\Contracts\Events\InboxScopedFact;
use App\Contracts\Navigation\ClientUpdate;

/**
 * An entry of an inbox's chat appeared or changed; the open windows of that inbox read it again.
 */
final readonly class ChatMessageChanged extends ChatEvent implements ClientUpdate, InboxScopedFact
{
    public function __construct(public string $inboxId, public string $chatMessageId) {}

    public function scopedInboxId(): string
    {
        return $this->inboxId;
    }
}
