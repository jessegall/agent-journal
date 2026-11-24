<?php

declare(strict_types=1);

namespace App\Contracts\Messages;

use App\Models\Inboxes\Inbox;

/**
 * Something messages are sent to; a message to it is stored in its inbox.
 */
interface MessageReceiver extends MessageParticipant
{
    public function inbox(): Inbox;
}
