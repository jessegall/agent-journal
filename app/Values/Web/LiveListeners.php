<?php

declare(strict_types=1);

namespace App\Values\Web;

use App\Events\Web\InboxAccessEnded;
use App\Events\Web\PageChanged;
use App\Events\Web\ProtectedViewInvalidated;
use App\Support\UserChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Inertia\SupportsLiveUpdates;

/**
 * The broadcast events that refresh a live prop, by their broadcast names, on the one channel they arrive on.
 */
final readonly class LiveListeners
{
    /**
     * @param  list<string>  $events
     */
    private function __construct(public array $events, public PrivateChannel $channel) {}

    /**
     * What changes a viewer's page: a page change, an inbox it lost, or a protected view it must drop, on its own
     * journal.user channel.
     */
    public static function pageChanges(string $userId): self
    {
        return new self(
            [
                PageChanged::NAME,
                InboxAccessEnded::NAME,
                ProtectedViewInvalidated::NAME,
            ],
            new PrivateChannel(UserChannel::nameFor($userId)),
        );
    }

    /**
     * Marks the prop live on these events and this channel.
     *
     * @template T of SupportsLiveUpdates
     *
     * @param  T  $prop
     * @return T
     */
    public function mark(SupportsLiveUpdates $prop): SupportsLiveUpdates
    {
        return $prop->live($this->events, $this->channel);
    }
}
