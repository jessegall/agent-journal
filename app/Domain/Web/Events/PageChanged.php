<?php

declare(strict_types=1);

namespace App\Domain\Web\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * Tells each allowed person's browser that what the pages show changed, so it reloads what it shows. It carries no
 * data: the browser reads the change through its own authorized request.
 */
final readonly class PageChanged implements ShouldBroadcast, ShouldDispatchAfterCommit
{
    public const string NAME = 'page.changed';

    /**
     * @param  list<int>  $personIds
     */
    public function __construct(public array $personIds) {}

    /**
     * @return list<PrivateChannel>
     */
    public function broadcastOn(): array
    {
        return array_map(fn (int $personId) => new PrivateChannel(PersonChannel::nameFor($personId)), $this->personIds);
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
