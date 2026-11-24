<?php

declare(strict_types=1);

namespace App\Contracts\Chat;

use App\Contracts\Assignments\Assignee;

/**
 * A stable place for work and messages: it holds assignments as an assignee and receives messages as an inbox, and
 * actors take part in it through its seats. A desk is never an actor.
 */
interface Desk extends Assignee, Inbox
{
    /**
     * The id of the desk, the seat an actor takes in a chat.
     */
    public function deskId(): string;

    /**
     * How many actors sit at the desk now.
     */
    public function seatCount(): int;
}
