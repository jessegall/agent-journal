<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Actors\Support\ActorContext;
use App\Web\Events\PageChanged;
use Illuminate\Support\Facades\Event;

/**
 * The owner as the current actor, with the page changes the work raises caught for the test to read.
 */
trait WatchesPageChanges
{
    use ActsAsActors;
    use ActsAsOwner;

    protected function setUpWatchesPageChanges(): void
    {
        $this->setUpActsAsOwner();
        $this->actAs(ActorContext::forUser($this->owner->id));
        Event::fake([PageChanged::class]);
    }
}
