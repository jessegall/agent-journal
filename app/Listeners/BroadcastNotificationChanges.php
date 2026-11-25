<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Events\Listener;
use App\Events\Messages\NotificationsChanged;
use App\Events\Web\NotificationsInvalidated;
use App\Models\Notifications\NotificationScope;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Turns a committed change of a scope's receipts into one content-free signal on its user's channel; a scope of an
 * agent has no browser and is told nothing. It hears the fact only after the commit, so a rolled-back change sends
 * nothing.
 */
final readonly class BroadcastNotificationChanges implements Listener
{
    public function __construct(private Dispatcher $events) {}

    public function handle(NotificationsChanged $fact): void
    {
        NotificationScope::resolveUserOf($fact->scopeId)->forAll(
            fn (string $userId) => $this->events->dispatch(new NotificationsInvalidated([$userId])),
        );
    }
}
