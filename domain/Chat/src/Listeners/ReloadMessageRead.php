<?php

declare(strict_types=1);

namespace Domain\Chat\Listeners;

use App\Attributes\Listeners\InCommandTransaction;
use App\Contracts\Events\Listener;
use App\Events\Messages\MessageRead;
use Domain\Chat\Models\ChatMessage;

/**
 * Once a member reads a message for the first time, its chat entry is read again, so the sender sees it read.
 */
#[InCommandTransaction]
final readonly class ReloadMessageRead implements Listener
{
    public function handle(MessageRead $event): void
    {
        $entry = ChatMessage::findForMessage($event->messageId);
        $entry?->reload();
    }
}
