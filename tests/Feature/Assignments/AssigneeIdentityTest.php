<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Contracts\Actors\Actor;
use App\Contracts\Assignments\Assignee;
use App\Support\ReflectedType;
use Domain\Tasks\TasksDomain;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * An assignee is not an actor by contract.
 */
final class AssigneeIdentityTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;

    private const array TABLES = ['users', 'agents', 'tasks', 'assignments', 'command_receipts'];

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    public function test_an_assignee_is_not_an_actor_by_contract(): void
    {
        $this->assertFalse(ReflectedType::of(Assignee::class)->implements(Actor::class));
    }
}
