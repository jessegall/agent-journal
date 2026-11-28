<?php

declare(strict_types=1);

namespace Domain\Chat\Listeners;

use App\Contracts\Events\Listener;
use App\Events\Messages\MessageRead;
use Domain\Chat\Models\ChatMessage;

/**
 * Once a member reads a message for the first time, its chat entry is read again, so the sender sees it read.
 */
final readonly class ReloadReadMessage implements Listener
{
    public function handle(MessageRead $event): void
    {
        ChatMessage::findForMessage($event->messageId)?->reload();
    }
}
