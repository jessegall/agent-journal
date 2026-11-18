<?php

declare(strict_types=1);

namespace App\Web\Events;

use App\Contracts\Event;
use App\Web\Support\UserChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * Tells each allowed user's browser that what the pages show changed, so it reloads what it shows. It carries no
 * data: the browser reads the change through its own authorized request.
 */
final readonly class PageChanged implements Event, ShouldBroadcast, ShouldDispatchAfterCommit
{
    public const string NAME = 'page.changed';

    /**
     * @param  list<int>  $userIds
     */
    public function __construct(public array $userIds) {}

    /**
     * @return list<PrivateChannel>
     */
    public function broadcastOn(): array
    {
        return array_map(fn (int $userId) => new PrivateChannel(UserChannel::nameFor($userId)), $this->userIds);
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
