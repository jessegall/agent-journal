<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Chat\AdmittedRecipients;
use App\Contracts\Chat\InboxResolver;
use App\Contracts\Events\InboxScopedFact;
use App\Contracts\Events\Listener;
use App\Contracts\Navigation\UserInterfaceUpdater;
use App\Events\ChatAccessEnded;
use App\Events\ChatMemberLeft;
use App\Events\PageChanged;
use App\Support\ChatInboxes;
use App\Support\ChatInterval;
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
        if ($fact instanceof ChatMemberLeft && $fact->member->type->isUser()) {
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
            array_filter($intervals, fn (ChatInterval $interval) => $interval->actor->type->isUser()),
        ));
    }
}
