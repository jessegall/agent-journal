<?php

declare(strict_types=1);

namespace App\Events\Web;

use App\Web\Data\RunningCommandData;
use App\Web\UserChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

/**
 * An agent's chat line changed: each user who shares a chat with the agent receives the new line, once, and shows it
 * with no page read.
 */
final readonly class RunningCommandChanged implements ShouldBroadcast, WebEvent
{
    public const string NAME = 'agent.running-command';

    /**
     * @param  list<string>  $userIds
     */
    public function __construct(public array $userIds, public RunningCommandData $command) {}

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
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return $this->command->toArray();
    }
}
