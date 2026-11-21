<?php

declare(strict_types=1);

namespace App\Web\Events;

use App\Contracts\Event;
use App\Web\Support\UserChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * Tells each affected user's browser that something it shows may no longer be theirs to see, so it drops what it
 * shows before reading again. It names nothing.
 */
final readonly class ProtectedViewInvalidated implements Event, ShouldBroadcast, ShouldDispatchAfterCommit
{
    public const string NAME = 'view.protected-invalidated';

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
