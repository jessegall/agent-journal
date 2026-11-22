<?php

declare(strict_types=1);

namespace App\Contracts\Chat;

use App\Exceptions\InboxUnavailable;

/**
 * Turns the provider's own stable id for an inbox into that inbox; it never creates one.
 */
interface InboxProvider
{
    /**
     * @throws InboxUnavailable
     */
    public function inboxFor(string $inboxId, string $providerId): Inbox;
}
