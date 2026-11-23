<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Chat\Inbox;
use App\Contracts\Chat\InboxProvider;
use App\Contracts\Chat\NamedInboxes;
use App\Exceptions\InboxUnavailable;
use App\Models\Desks\DeskRecord;
use PhpOption\Option;

/**
 * Desks as inboxes: the inbox of a desk is the desk itself, labelled by the desk and found by its name.
 */
final readonly class DeskInboxProvider implements InboxProvider, NamedInboxes
{
    public function inboxFor(string $inboxId, string $providerId): Inbox
    {
        return DeskRecord::query()->whereKey($providerId)->firstOr(fn () => throw InboxUnavailable::forId($inboxId));
    }

    public function inboxNamed(string $name): Option
    {
        return DeskRecord::withName($name);
    }
}
