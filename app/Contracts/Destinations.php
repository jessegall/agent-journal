<?php

declare(strict_types=1);

namespace App\Contracts;

/**
 * Where work and messages for a selected recipient go: the assignee that holds its work and the inbox it reads.
 */
interface Destinations
{
    public function assignee(): Assignee;

    public function inbox(): Inbox;
}
