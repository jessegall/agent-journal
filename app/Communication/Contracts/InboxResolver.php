<?php

declare(strict_types=1);

namespace App\Communication\Contracts;

use App\Communication\Exceptions\InboxUnavailable;

/**
 * Resolves an admitted inbox id to its inbox through the provider registered for it; it never creates a row.
 */
interface InboxResolver
{
    /**
     * @throws InboxUnavailable
     */
    public function resolve(string $inboxId): Inbox;

    /**
     * The inbox a provider knows by this stable name.
     *
     * @throws InboxUnavailable
     */
    public function named(string $name): Inbox;
}
