<?php

declare(strict_types=1);

namespace App\Contracts\Records;

use App\Contracts\Assignments\Assignee;
use App\Contracts\Chat\Inbox;

/**
 * Where work and messages for a selected recipient go: the assignee that holds its work and the inbox it reads.
 */
interface Destinations
{
    public function assignee(): Assignee;

    public function inbox(): Inbox;
}
