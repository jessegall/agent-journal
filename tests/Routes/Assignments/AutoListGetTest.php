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
 * The owner lists the pools an agent takes records from on its own: nothing is sent on.
 */
#[TestsRoute('GET', 'assignments.auto.list')]
final class AutoListGetTest extends GuardedRouteEntryTestCase
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
            ]);
    }
}
