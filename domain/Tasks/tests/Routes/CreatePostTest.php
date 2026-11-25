<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Routes;

use Domain\Tasks\TasksDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of POST tasks.create, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('POST', 'tasks.create')]
final class CreatePostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('POST tasks.create', [
            'the payload',
            'the expected commands',
        ]);
    }
}
