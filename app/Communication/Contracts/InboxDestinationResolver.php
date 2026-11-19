<?php

declare(strict_types=1);

namespace App\Communication\Contracts;

use App\Assignments\Exceptions\AssigneeUnavailable;
use App\Assignments\Support\AssigneeIdentity;
use App\Communication\Exceptions\InboxUnavailable;

/**
 * The inbox a message to the requested recipient goes to: the recipient's own, or that of the desk it forwards to.
 */
interface InboxDestinationResolver
{
    /**
     * @throws AssigneeUnavailable
     * @throws InboxUnavailable
     */
    public function resolve(AssigneeIdentity $requested): Inbox;
}
