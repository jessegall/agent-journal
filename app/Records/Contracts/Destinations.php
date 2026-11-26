<?php

declare(strict_types=1);

namespace App\Records\Contracts;

use App\Assignments\Contracts\Assignee;
use App\Inboxes\Contracts\LabeledInbox;

/**
 * Where work and messages for a selected recipient go: the assignee that holds its work and the inbox it reads.
 */
interface Destinations
{
    /**
     * The assignee work for this destination goes to.
     */
    public function assignee(): Assignee;

    /**
     * The inbox messages for this destination go to.
     */
    public function inbox(): LabeledInbox;
}
