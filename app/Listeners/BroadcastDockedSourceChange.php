<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Chat\InboxResolver;
use App\Contracts\Events\Listener;
use App\Contracts\Navigation\UserInterfaceUpdater;
use App\Events\PageChanged;
use App\Support\Cards\DockIdentity;
use App\Support\ChatInboxes;
use App\Support\Sources\Contracts\DockedSources;
use App\Support\Sources\Contracts\DockSourceChanged;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Turns a committed change of a docked source into one page change, so the docks showing it read its card again; a
 * source docked nowhere changes no page, and a fact that changes pages anyway is left to BroadcastPageChange.
 */
final readonly class BroadcastDockedSourceChange implements Listener
{
    public function __construct(
        private DockedSources $docked,
        private ChatInboxes $chats,
        private InboxResolver $inboxes,
        private Dispatcher $events,
    ) {}

    public function handle(DockSourceChanged $fact): void
    {
        if ($fact instanceof UserInterfaceUpdater) {
            return;
        }

        $source = new DockIdentity($fact->dockType(), $fact->dockId());
        $userIds = $this->membersOf($this->docked->inboxesDocking($source));

        if ($userIds === []) {
            return;
        }

        $this->events->dispatch(new PageChanged($userIds));
    }

    /**
     * The users who are active members of any of these chats now, each once.
     *
     * @param  list<string>  $inboxIds
     * @return list<string>
     */
    private function membersOf(array $inboxIds): array
    {
        $userIds = [];

        foreach ($inboxIds as $inboxId) {
            foreach ($this->chats->activeIntervals($this->inboxes->resolve($inboxId)) as $interval) {
                if ($interval->actor->type->isUser()) {
                    $userIds[$interval->actor->id] = true;
                }
            }
        }

        return array_keys($userIds);
    }
}
