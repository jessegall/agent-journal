<?php

declare(strict_types=1);

namespace App\Desks\Support;

use App\Assignments\Contracts\Assignee;
use App\Communication\Contracts\Inbox;
use App\Desks\Contracts\Destinations;

/**
 * The resolved destinations of a recipient, for the direct and the forwarding case alike.
 */
final readonly class ResolvedDestinations implements Destinations
{
    public function __construct(private Assignee $holder, private Inbox $address) {}

    public function assignee(): Assignee
    {
        return $this->holder;
    }

    public function inbox(): Inbox
    {
        return $this->address;
    }
}
