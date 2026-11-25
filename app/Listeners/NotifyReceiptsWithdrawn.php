<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Events\Listener;
use App\Contracts\Web\ProtectedViews;
use App\Events\Messages\NotificationsWithdrawn;

/**
 * Tells a user's open tabs that receipts were taken from them, so they drop what they show before reading again; an
 * agent has no browser to tell.
 */
final readonly class NotifyReceiptsWithdrawn implements Listener
{
    public function __construct(private ProtectedViews $views) {}

    /**
     * Signals the recipient's own view channel; only a signed-in browser joins one, so a recipient without a view
     * hears nothing.
     */
    public function handle(NotificationsWithdrawn $fact): void
    {
        $this->views->invalidateFor([$fact->recipient->id]);
    }
}
