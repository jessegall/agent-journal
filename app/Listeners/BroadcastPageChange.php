<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Events\InboxScopedFact;
use App\Contracts\Events\Listener;
use App\Events\Web\PageChanged;
use App\Messages\Contracts\AdmittedRecipients;
use App\Models\Access\User;
use App\Models\Inboxes\InboxMember;
use App\Navigation\Contracts\ClientUpdate;
use App\Support\ActorReference;
use Illuminate\Contracts\Events\Dispatcher;
use Psr\Log\LoggerInterface;

/**
 * Turns each committed fact that changes what a page shows into one page change for the users Access allows. The
 * producers raise their facts after commit and know nothing of the browser.
 */
final readonly class BroadcastPageChange implements Listener
{
    public function __construct(
        private AdmittedRecipients $recipients,
        private Dispatcher $events,
        private LoggerInterface $log,
    ) {}

    public function handle(ClientUpdate $fact): void
    {
        $userIds = $fact instanceof InboxScopedFact
            ? array_map(
                fn (ActorReference $user) => $user->id,
                InboxMember::resolveAttachedTo([$fact->scopedInboxId()], User::class),
            )
            : $this->recipients->userIds();

        $this->log->info('A page fact was committed.', ['fact' => $fact::class, 'users' => count($userIds)]);

        if ($userIds === []) {
            return;
        }

        $this->events->dispatch(new PageChanged($userIds));
    }
}
