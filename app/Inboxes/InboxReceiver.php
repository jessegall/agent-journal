<?php

declare(strict_types=1);

namespace App\Inboxes;

use App\Messages\Contracts\MessageReceiver;
use App\Models\Inboxes\Inbox;

/**
 * An inbox addressed by its id: a message sent to it is stored in that inbox.
 */
final readonly class InboxReceiver implements MessageReceiver
{
    public function __construct(private Inbox $inbox) {}

    public function participantType(): string
    {
        return Inbox::ASSIGNEE_TYPE;
    }

    public function participantId(): string
    {
        return $this->inbox->id;
    }

    public function inbox(): Inbox
    {
        return $this->inbox;
    }
}
