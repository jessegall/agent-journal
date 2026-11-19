<?php

declare(strict_types=1);

namespace App\Desks\Contracts;

use App\Assignments\Contracts\Assignee;
use App\Communication\Contracts\Inbox;

/**
 * A stable place for work and messages: it holds assignments as an assignee and receives messages as an inbox, and
 * actors take part in it through its seats. A desk is never an actor.
 */
interface Desk extends Assignee, Inbox
{
    public function deskId(): string;

    public function seatCount(): int;
}
