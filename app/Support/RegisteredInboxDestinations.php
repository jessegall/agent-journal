<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Inboxes\LabeledInbox;
use App\Contracts\Chat\InboxDestinationResolver;

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
