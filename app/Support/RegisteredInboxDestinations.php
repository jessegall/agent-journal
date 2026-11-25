<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Inboxes\InboxDestinationResolver;
use App\Contracts\Inboxes\LabeledInbox;

/**
 * The inbox side of a recipient's destinations.
 */
final readonly class RegisteredInboxDestinations implements InboxDestinationResolver
{
    public function __construct(private DestinationRegistry $destinations) {}

    public function resolve(AssigneeIdentity $requested): LabeledInbox
    {
        return $this->destinations->destinationsFor($requested)->inbox();
    }
}
