<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Routes;

use Domain\Plans\PlansDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of POST plans.work.unassign, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('POST', 'plans.work.unassign')]
final class WorkUnassignPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('POST plans.work.unassign', [
            'the payload',
            'the expected commands',
        ]);
    }
}
