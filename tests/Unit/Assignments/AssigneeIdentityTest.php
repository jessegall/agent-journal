<?php

declare(strict_types=1);

namespace Tests\Unit\Assignments;

use App\Actors\Contracts\Actor;
use App\Assignments\Contracts\Assignee;
use App\Support\Reflector;
use Domain\Tasks\TasksDomain;
use Tests\Support\DomainBoot;
use Tests\TestCase;

/**
 * An assignee is not an actor by contract.
 */
final class AssigneeIdentityTest extends TestCase
{
    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    public function test_an_assignee_is_not_an_actor_by_contract(): void
    {
        $this->assertFalse(Reflector::of(Assignee::class)->implements(Actor::class));
    }
}
