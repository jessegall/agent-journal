<?php

declare(strict_types=1);

namespace Tests\Feature\Actors;

use App\Exceptions\ActorContextMissing;
use App\Support\ActorContext;
use Domain\Plans\PlansDomain;
use Tests\Support\DomainBoot;
use Tests\TestCase;

final class ActorContextTest extends TestCase
{
    /**
     * Plans, whose page the signed-in request opens.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class);
    }

    public function test_a_request_without_an_authenticated_actor_has_none(): void
    {
        $this->expectException(ActorContextMissing::class);

        $this->app->make(ActorContext::class);
    }
}
