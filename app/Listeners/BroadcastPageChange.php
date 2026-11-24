<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Events\InboxScopedFact;
use App\Contracts\Events\Listener;
use App\Contracts\Chat\AdmittedRecipients;
use App\Contracts\Navigation\UserInterfaceUpdater;
use App\Enums\ActorType;
use App\Events\Web\PageChanged;
use App\Models\Inboxes\InboxMember;
use App\Support\ActorIdentity;
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

    public function handle(UserInterfaceUpdater $fact): void
    {
        $userIds = $fact instanceof InboxScopedFact
            ? array_map(
                fn (ActorIdentity $user) => $user->id,
                InboxMember::attachedTo([$fact->scopedInboxId()], ActorType::User),
            )
            : $this->recipients->userIds();

        $this->log->info('A page fact was committed.', ['fact' => $fact::class, 'users' => count($userIds)]);

        if ($userIds === []) {
            return;
        }

        $this->events->dispatch(new PageChanged($userIds));
    }
}
