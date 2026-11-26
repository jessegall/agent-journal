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
 * The owner reads whether an agent takes tasks on its own: nothing is sent on.
 */
#[TestsRoute('GET', 'assignments.auto.show')]
final class AutoShowGetTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $builder = $journal->signedStart('Builder');

        return RouteCall::as(Caller::User)
            ->query([
                'actorType' => 'agent',
                'actorId' => $builder->agent->id,
                'assignableType' => 'tasks.task',
            ]);
    }
}
