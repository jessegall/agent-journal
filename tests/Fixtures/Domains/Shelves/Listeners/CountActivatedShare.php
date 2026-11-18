<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Shelves\Listeners;

use App\Sharing\Events\ShareActivated;

/**
 * A module listening to Core's exported sharing event without any change to Sharing.
 */
final class CountActivatedShare
{
    public function handle(ShareActivated $event): void {}
}
