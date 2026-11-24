<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Activity\ActivityLog;
use App\Contracts\Events\Listener;
use App\Enums\ActivityType;
use App\Events\ChatMessageAccepted;
use App\Models\Chats\InboxInterval;
use App\Models\Messages\Message;
use App\Models\Scopes\MessageVisibility;

/**
 * Records what an agent posted in a chat a user takes part in, by its first characters; messages between agents
 * alone are not activity a user follows.
 */
final readonly class RecordChatPostActivity implements Listener
{
    public function __construct(private ActivityLog $activity) {}

    public function handle(ChatMessageAccepted $fact): void
    {
        if ($fact->author->isUser() || ! InboxInterval::hasUserIn($fact->inboxId)) {
            return;
        }

        $message = Message::query()->withoutGlobalScope(MessageVisibility::class)->findOrFail($fact->messageId);

        $this->activity->record($fact->author, ActivityType::Posted, $message->body);
    }
}
