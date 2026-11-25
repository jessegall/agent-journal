<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Inboxes\InboxProvider;
use App\Contracts\Inboxes\LabeledInbox;
use App\Contracts\Inboxes\NamedInboxes;
use App\Exceptions\InboxUnavailable;
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
        return Inbox::named($name);
    }
}
