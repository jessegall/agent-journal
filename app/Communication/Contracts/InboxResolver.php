<?php

declare(strict_types=1);

namespace App\Communication\Contracts;

use App\Communication\Exceptions\InboxUnavailable;
use App\Communication\Support\InboxMembership;

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

    /**
     * The access that guards the inbox's membership, from its provider's registration.
     *
     * @throws InboxUnavailable
     */
    public function accessFor(Inbox $inbox): InboxAccess;

    /**
     * Who is seated at the inbox now.
     *
     * @return list<InboxMembership>
     */
    public function membersOf(Inbox $inbox): array;
}
