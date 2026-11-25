<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests;

use App\Contracts\Actors\CurrentActorSetter;
use App\Support\ActorReference;
use App\Values\OwnerAuthority;
use Domain\Helpers\HelpersDomain;
use Tests\Support\DomainBoot;
use Tests\TestCase as BaseTestCase;

/**
 * The base of every test of the Helpers domain, so what all of them share has one place.
 */
abstract class TestCase extends BaseTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(HelpersDomain::class);
    }

    /**
     * Acts as the user as the owner, the parent whose helper records the test reads and writes.
     */
    protected function actAsUser(string $userId): ActorReference
    {
        $actor = ActorReference::forUser($userId);
        $this->app->make(CurrentActorSetter::class)->set($actor, new OwnerAuthority('test'));

        return ActorReference::of($actor);
    }
}
