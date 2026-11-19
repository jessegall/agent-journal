<?php

declare(strict_types=1);

namespace Tests\Support;

use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;

/**
 * Makes the journal's owner, a real user, before each test and binds the access settings to them.
 */
trait ActsAsOwner
{
    protected User $owner;

    protected function setUpActsAsOwner(): void
    {
        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
    }
}
