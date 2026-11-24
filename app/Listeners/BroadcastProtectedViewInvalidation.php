<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Messages\AdmittedRecipients;
use App\Contracts\Events\Listener;
use App\Events\Web\ProtectedViewInvalidated;
use App\Events\Sharing\ShareRevoked;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Turns a revoked share, which may take something from users' open pages, into one content-free signal to every user
 * Access admits: it cannot name who saw what, so it reaches them all.
 */
final readonly class BroadcastProtectedViewInvalidation implements Listener
{
    public function __construct(
        private AdmittedRecipients $recipients,
        private Dispatcher $events,
    ) {}

    public function handle(ShareRevoked $fact): void
    {
        $userIds = $this->recipients->userIds();

        if ($userIds === []) {
            return;
        }

        $this->events->dispatch(new ProtectedViewInvalidated($userIds));
    }
}
