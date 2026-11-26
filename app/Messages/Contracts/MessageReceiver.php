<?php

declare(strict_types=1);

namespace App\Messages\Contracts;

use App\Models\Inboxes\Inbox;

/**
 * Something messages are sent to; a message to it is stored in its inbox.
 */
interface MessageReceiver extends MessageParticipant
{
    /**
     * The inbox a message to this receiver is stored in.
     */
    public function inbox(): Inbox;
}
