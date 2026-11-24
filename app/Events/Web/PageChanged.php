<?php

declare(strict_types=1);

namespace App\Events\Web;

use App\Support\UserChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

/**
 * Tells each allowed user's browser that what the pages show changed, so it reloads what it shows. It carries no
 * data: the browser reads the change through its own authorized request.
 */
final readonly class PageChanged extends WebEvent implements ShouldBroadcast
{
    public const string NAME = 'page.changed';

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
