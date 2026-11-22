<?php

declare(strict_types=1);

namespace App\Web\Listeners;

use App\Actors\Contracts\AdmittedRecipients;
use App\Actors\Enums\ActorType;
use App\Communication\Contracts\InboxResolver;
use App\Communication\Contracts\InboxScopedFact;
use App\Communication\Events\ChatMemberLeft;
use App\Communication\Support\ChatInboxes;
use App\Communication\Support\ChatInterval;
use App\Contracts\Listener;
use App\Ui\Contracts\UserInterfaceUpdater;
use App\Web\Events\ChatAccessEnded;
use App\Web\Events\PageChanged;
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
        private ChatInboxes $chats,
        private InboxResolver $inboxes,
        private Dispatcher $events,
        private LoggerInterface $log,
    ) {}

    public function handle(UserInterfaceUpdater $fact): void
    {
        if ($fact instanceof ChatMemberLeft && $fact->member->type === ActorType::User) {
            $this->events->dispatch(new ChatAccessEnded($fact->member->id, $fact->inboxId));
        }

        $userIds = $fact instanceof InboxScopedFact
            ? $this->membersOf($fact->scopedInboxId())
            : $this->recipients->userIds();
        $this->log->info('A page fact was committed.', ['fact' => $fact::class, 'users' => count($userIds)]);

        if ($userIds === []) {
            return;
        }

        $this->events->dispatch(new PageChanged($userIds));
    }

    /**
     * The users who are active members of the chat now; one who left is no longer among them.
     *
     * @return list<string>
     */
    private function membersOf(string $inboxId): array
    {
        $intervals = $this->chats->activeIntervals($this->inboxes->resolve($inboxId));

        return array_values(array_map(
            fn (ChatInterval $interval) => $interval->actor->id,
            array_filter($intervals, fn (ChatInterval $interval) => $interval->actor->type === ActorType::User),
        ));
    }
}
