<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Events\Listener;
use App\Contracts\Navigation\UserInterfaceUpdater;
use App\Events\Web\PageChanged;
use App\Models\Access\User;
use App\Models\Inboxes\InboxMember;
use App\Support\ActorIdentity;
use App\Support\Cards\DockIdentity;
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
        private Dispatcher $events,
    ) {}

    public function handle(DockSourceChanged $fact): void
    {
        if ($fact instanceof UserInterfaceUpdater) {
            return;
        }

        $source = new DockIdentity($fact->dockType(), $fact->dockId());
        $userIds = array_map(
            fn (ActorIdentity $user) => $user->id,
            InboxMember::attachedTo($this->docked->inboxesDocking($source), User::class),
        );

        if ($userIds === []) {
            return;
        }

        $this->events->dispatch(new PageChanged($userIds));
    }
}
