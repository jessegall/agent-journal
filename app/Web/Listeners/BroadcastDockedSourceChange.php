<?php

declare(strict_types=1);

namespace App\Web\Listeners;

use App\Actors\Contracts\AdmittedRecipients;
use App\Contracts\Listener;
use App\Docking\Cards\DockIdentity;
use App\Docking\Sources\Contracts\DockedSources;
use App\Docking\Sources\Contracts\DockSourceChanged;
use App\Ui\Contracts\UserInterfaceUpdater;
use App\Web\Events\PageChanged;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Turns a committed change of a docked source into one page change, so the docks showing it read its card again; a
 * source docked nowhere changes no page, and a fact that changes pages anyway is left to BroadcastPageChange.
 */
final readonly class BroadcastDockedSourceChange implements Listener
{
    public function __construct(
        private DockedSources $docked,
        private AdmittedRecipients $recipients,
        private Dispatcher $events,
    ) {}

    public function handle(DockSourceChanged $fact): void
    {
        if ($fact instanceof UserInterfaceUpdater) {
            return;
        }

        if (! $this->docked->isDocked(new DockIdentity($fact->dockType(), $fact->dockId()))) {
            return;
        }

        $userIds = $this->recipients->userIds();

        if ($userIds === []) {
            return;
        }

        $this->events->dispatch(new PageChanged($userIds));
    }
}
