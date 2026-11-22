<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Enums\ActorType;
use App\Support\ActorIdentity;

/**
 * Agent 7, the builder the tests assign work to, under a request of user 1.
 */
trait HasBuilderAgent
{
    use StartsAgentRequests;

    private ActorIdentity $builder;

    protected function setUpHasBuilderAgent(): void
    {
        $this->builder = new ActorIdentity(ActorType::Agent, TestIds::of(7));
        $this->startUserRequestAs(TestIds::of(1));
    }
}
