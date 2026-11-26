<?php

declare(strict_types=1);

namespace App\Inboxes;

use App\Exceptions\InboxUnavailable;
use App\Inboxes\Contracts\InboxProvider;
use App\Inboxes\Contracts\LabeledInbox;
use App\Inboxes\Contracts\NamedInboxes;
use App\Models\Inboxes\Inbox;
use PhpOption\Option;

/**
 * Core's own inboxes as an inbox provider: the inbox is its own label and is found by its name.
 */
final readonly class CoreInboxes implements InboxProvider, NamedInboxes
{
    public function inboxFor(string $inboxId, string $providerId): LabeledInbox
    {
        return Inbox::query()->whereKey($inboxId)->firstOr(InboxUnavailable::throwing()->forId($inboxId));
    }

    public function inboxNamed(string $name): Option
    {
        return Inbox::findNamed($name);
    }
}
