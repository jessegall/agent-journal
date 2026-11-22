<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Event;
use App\Support\UserChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

/**
 * One user's access to one chat ended: it left, was removed or the chat closed. Its window reads the page again and
 * hears nothing more about that chat.
 */
final readonly class ChatAccessEnded implements Event, ShouldBroadcast
{
    public const string NAME = 'chat.access-ended';

    public function __construct(public string $userId, public string $inboxId) {}

    /**
     * @return list<PrivateChannel>
     */
    public function broadcastOn(): array
    {
        return [new PrivateChannel(UserChannel::nameFor($this->userId))];
    }

    public function broadcastAs(): string
    {
        return self::NAME;
    }

    /**
     * @return array{inboxId: string}
     */
    public function broadcastWith(): array
    {
        return ['inboxId' => $this->inboxId];
    }
}
