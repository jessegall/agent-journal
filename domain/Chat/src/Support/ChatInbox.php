<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use App\Contracts\Chat\Inbox;

/**
 * A chat as an inbox: the chat inbox's id and the label its reader sees for it.
 */
final readonly class ChatInbox implements Inbox
{
    public function __construct(private string $inboxId, private string $label) {}

    public function inboxId(): string
    {
        return $this->inboxId;
    }

    public function inboxLabel(): string
    {
        return $this->label;
    }
}
