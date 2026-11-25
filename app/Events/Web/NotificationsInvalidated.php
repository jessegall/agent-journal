<?php

declare(strict_types=1);

namespace App\Events\Web;

use App\Support\UserChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

/**
 * Tells each user's browser that its notifications changed, so it reads them again; it names nothing, no title, no
 * receipt and no count.
 */
final readonly class NotificationsInvalidated implements ShouldBroadcast, WebEvent
{
    public const string NAME = 'notifications.changed';

    /**
     * @param  list<string>  $userIds
     */
    public function __construct(public array $userIds) {}

    /**
     * @return list<PrivateChannel>
     */
    public function broadcastOn(): array
    {
        return array_map(fn (string $userId) => new PrivateChannel(UserChannel::nameFor($userId)), $this->userIds);
    }

    public function broadcastAs(): string
    {
        return self::NAME;
    }

    /**
     * @return array<string, never>
     */
    public function broadcastWith(): array
    {
        return [];
    }
}
