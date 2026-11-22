<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Contracts\CurrentActorSetter;
use App\Support\ActorContext;
use App\Values\OwnerAuthority;
use Domain\Access\Support\AccessSettings;

/**
 * Test user 7 as the journal's owner and the current actor, under the owner's authority.
 */
trait ActsAsTestOwner
{
    protected function setUpActsAsTestOwner(): void
    {
        $ownerId = TestIds::of(7);
        $this->app->instance(AccessSettings::class, new AccessSettings($ownerId));
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser($ownerId), new OwnerAuthority('test'));
    }
}
