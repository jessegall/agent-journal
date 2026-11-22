<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Inbox;
use App\Contracts\InboxDestinationResolver;

/**
 * The inbox side of a recipient's destinations.
 */
final readonly class RegisteredInboxDestinations implements InboxDestinationResolver
{
    public function __construct(private DestinationRegistry $destinations) {}

    public function resolve(AssigneeIdentity $requested): Inbox
    {
        return $this->destinations->destinationsFor($requested)->inbox();
    }
}
