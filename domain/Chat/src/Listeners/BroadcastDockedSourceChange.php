<?php

declare(strict_types=1);

namespace Domain\Chat\Listeners;

use App\Contracts\Events\Listener;
use App\Navigation\Contracts\ClientUpdate;
use App\Records\Contracts\RecordChanged;
use Domain\Chat\Contracts\Docking\DockedSources;
use Domain\Chat\Events\DockedSourceChanged;
use Domain\Chat\Support\Cards\DockIdentity;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Turns a committed change of a docked source into a change of each chat docking it, so the docks showing it read
 * its card again; a source docked nowhere changes no page, and a fact that changes pages anyway is left as it is.
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

        foreach ($this->docked->inboxesDocking($source) as $inboxId) {
            $this->events->dispatch(new DockedSourceChanged($inboxId));
        }
    }
}
