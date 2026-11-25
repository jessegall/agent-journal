<?php

declare(strict_types=1);

namespace Domain\Memory\Tests\Routes;

use Domain\Memory\MemoryDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of POST memory.save, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('POST', 'memory.save')]
final class SavePostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(MemoryDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('POST memory.save', [
            'the payload',
            'the expected commands',
        ]);
    }
}
