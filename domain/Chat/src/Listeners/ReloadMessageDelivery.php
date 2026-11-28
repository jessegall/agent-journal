<?php

declare(strict_types=1);

namespace Domain\Chat\Listeners;

use App\Contracts\Events\Listener;
use App\Events\Messages\MessageDeliveryChanged;
use Domain\Chat\Models\ChatMessage;

/**
 * Once a message's delivery moves, arriving, failing or queued again, its chat entry is read again with its ticks.
 */
final readonly class ReloadMessageDelivery implements Listener
{
    public function handle(MessageDeliveryChanged $event): void
    {
        ChatMessage::findForMessage($event->messageId)?->reload();
    }
}
