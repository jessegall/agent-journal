<?php

declare(strict_types=1);

namespace Domain\Chat\Listeners;

use App\Attributes\Listeners\InCommandTransaction;
use App\Contracts\Events\Listener;
use App\Events\Messages\MessageDeliveryChanged;
use Domain\Chat\Models\ChatMessage;

/**
 * Once a message's delivery moves, arriving, failing or queued again, its chat entry is read again with its ticks; it
 * writes the entry within the command that moved the delivery, as nothing is written outside a command.
 */
#[InCommandTransaction]
final readonly class ReloadMessageDelivery implements Listener
{
    public function handle(MessageDeliveryChanged $event): void
    {
        $entry = ChatMessage::findForMessage($event->messageId);
        $entry?->reload();
    }
}
