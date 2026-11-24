<?php

declare(strict_types=1);

namespace App\Contracts\Chat;

use App\Exceptions\AssigneeUnavailable;
use App\Exceptions\InboxUnavailable;
use App\Support\AssigneeIdentity;
use App\Contracts\Inboxes\LabeledInbox;

/**
 * The inbox a message to the requested recipient goes to: the recipient's own, or that of the desk it forwards to.
 */
interface InboxDestinationResolver
{
    /**
     * @throws AssigneeUnavailable
     * @throws InboxUnavailable
     */
    public function resolve(AssigneeIdentity $requested): LabeledInbox;
}
