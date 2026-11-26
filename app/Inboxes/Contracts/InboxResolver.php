<?php

declare(strict_types=1);

namespace App\Inboxes\Contracts;

use App\Exceptions\InboxUnavailable;

/**
 * Resolves an admitted inbox id to its inbox through the provider registered for it; it never creates a row.
 */
interface InboxResolver
{
    /**
     * @throws InboxUnavailable
     */
    public function resolve(string $inboxId): LabeledInbox;

    /**
     * The inbox a provider knows by this stable name.
     *
     * @throws InboxUnavailable
     */
    public function named(string $name): LabeledInbox;
}
