<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Bus\Contracts\CommandBus;

/**
 * Makes an actor the current one with the owner's authority, and runs commands as them on a fresh request.
 */
trait ActsAsActors
{
    private function actAs(ActorContext $actor): void
    {
        $this->app->make(CurrentActorSetter::class)->set($actor, new OwnerAuthority('test'));
    }

    private function runAs(ActorContext $actor, object $command): mixed
    {
        $this->app->forgetScopedInstances();
        $this->actAs($actor);

        return $this->app->make(CommandBus::class)->run($command);
    }

    private function asUser(object $command): mixed
    {
        return $this->runAs(TestActors::user(7), $command);
    }
}
