<?php

declare(strict_types=1);

namespace Tests\Routes\Assignments;

use Domain\Tasks\TasksDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent reads whether an agent takes tasks on its own: nothing is sent on.
 */
#[TestsRoute('POST', 'assignments.agent.auto.show')]
final class AgentAutoShowPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $start = $journal->signedStart('Planner');
        $builder = $journal->signedStart('Builder');

        return RouteCall::as(Caller::Agent, $start)
            ->payload([
                'actor_type' => 'agent',
                'actor_id' => $builder->agent->id,
                'assignable_type' => 'tasks.task',
            ]);
    }
}
