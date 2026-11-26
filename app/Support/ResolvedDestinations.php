<?php

declare(strict_types=1);

namespace App\Support;

use App\Assignments\Contracts\Assignee;
use App\Inboxes\Contracts\LabeledInbox;
use App\Records\Contracts\Destinations;

/**
 * The resolved destinations of a recipient, for the direct and the forwarding case alike.
 */
final readonly class ResolvedDestinations implements Destinations
{
    public function __construct(private Assignee $holder, private LabeledInbox $address) {}

    public function assignee(): Assignee
    {
        return $this->holder;
    }

    public function inbox(): LabeledInbox
    {
        return $this->address;
    }
}
