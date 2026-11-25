<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Models\Access\User;
use App\Support\Access\AccessSettings;

/**
 * Makes the journal's owner, a real user, before each test and binds the access settings to them.
 */
trait ActsAsOwner
{
    protected User $owner;

    /**
     * Makes the owner once, however many of the test's traits ask for it.
     */
    protected function setUpActsAsOwner(): void
    {
        if (isset($this->owner)) {
            return;
        }

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
    }
}
