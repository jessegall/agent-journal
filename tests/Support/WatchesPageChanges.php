<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Events\Web\PageChanged;
use Illuminate\Support\Facades\Event;

/**
 * The owner as the current actor, with the page changes the work raises caught for the test to read.
 */
trait WatchesPageChanges
{
    use ActsAsActors;

    protected function setUpWatchesPageChanges(): void
    {
        $this->journal->owner();
        Event::fake([PageChanged::class]);
    }
}
