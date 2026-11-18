<?php

declare(strict_types=1);

namespace App\Web\Listeners;

use App\Ui\Contracts\UpdatesUserInterface;
use App\Web\Contracts\JournalAccessPolicy;
use App\Web\Events\PageChanged;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Turns each committed fact that changes what a page shows into one page change for the users Access allows. The
 * producers raise their facts after commit and know nothing of the browser.
 */
final readonly class BroadcastPageChange
{
    public function __construct(
        private JournalAccessPolicy $access,
        private Dispatcher $events,
    ) {}

    public function handle(UpdatesUserInterface $fact): void
    {
        $userIds = $this->access->allowedUserIds();

        if ($userIds === []) {
            return;
        }

        $this->events->dispatch(new PageChanged($userIds));
    }
}
