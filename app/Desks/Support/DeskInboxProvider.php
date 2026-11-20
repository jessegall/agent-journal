<?php

declare(strict_types=1);

namespace App\Desks\Support;

use App\Communication\Contracts\Inbox;
use App\Communication\Contracts\InboxProvider;
use App\Communication\Contracts\NamedInboxes;
use App\Communication\Exceptions\InboxUnavailable;
use App\Desks\Models\DeskRecord;
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
        return Option::fromValue(DeskRecord::query()->named($name)->first());
    }
}
