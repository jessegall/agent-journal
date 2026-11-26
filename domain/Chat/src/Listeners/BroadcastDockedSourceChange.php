<?php

declare(strict_types=1);

namespace Domain\Chat\Listeners;

use App\Contracts\Events\Listener;
use App\Events\Web\PageChanged;
use App\Models\Access\User;
use App\Models\Inboxes\InboxMember;
use App\Navigation\Contracts\ClientUpdate;
use App\Records\Contracts\RecordChanged;
use App\Support\ActorReference;
use Domain\Chat\Contracts\Docking\DockedSources;
use Domain\Chat\Support\Cards\DockIdentity;
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

    public function handle(RecordChanged $fact): void
    {
        if ($fact instanceof ClientUpdate) {
            return;
        }

        $source = new DockIdentity($fact->recordType(), $fact->recordId());

        $userIds = array_map(
            fn (ActorReference $user) => $user->id,
            InboxMember::resolveAttachedTo($this->docked->inboxesDocking($source), User::class),
        );

        if ($userIds === []) {
            return;
        }

        $this->events->dispatch(new PageChanged($userIds));
    }
}
