<?php

declare(strict_types=1);

namespace App\Events\Web;

use App\Web\UserChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

/**
 * One user's access to one inbox ended: it left or was removed. Its window reads the page again and hears nothing
 * more about that inbox.
 */
final readonly class InboxAccessEnded implements ShouldBroadcast, WebEvent
{
    public const string NAME = 'inbox.access-ended';

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
