<?php

declare(strict_types=1);

namespace App\Support;

use App\Assignments\DestinationRegistry;
use App\Inboxes\Contracts\InboxDestinationResolver as InboxDestinationResolverContract;
use App\Inboxes\Contracts\LabeledInbox;

/**
 * The inbox side of a recipient's destinations.
 */
final readonly class InboxDestinationResolver implements InboxDestinationResolverContract
{
    public function __construct(private DestinationRegistry $destinations) {}

    public function resolve(AssigneeIdentity $requested): LabeledInbox
    {
        return $this->destinations->destinationsFor($requested)->inbox();
    }
}
