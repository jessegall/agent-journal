<?php

declare(strict_types=1);

namespace App\Inboxes;

use App\Exceptions\InboxUnavailable;
use App\Inboxes\Contracts\InboxProvider;
use App\Inboxes\Contracts\LabeledInbox;
use App\Models\Inboxes\Inbox;

/**
 * Core's own inboxes as an inbox provider: the inbox is its own label and is found by its name.
 */
final readonly class CoreInboxes implements InboxProvider
{
    public function inboxFor(string $inboxId, string $providerId): LabeledInbox
    {
        return Inbox::query()->whereKey($inboxId)->firstOr(InboxUnavailable::throwing()->forId($inboxId));
    }
}
