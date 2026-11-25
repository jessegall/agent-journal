<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Routes;

use Domain\Sharing\SharingDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of POST sharing.refresh-share-scope, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('POST', 'sharing.refresh-share-scope')]
final class RefreshShareScopePostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(SharingDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('POST sharing.refresh-share-scope', [
            '{share}',
            'the payload',
            'the expected commands',
        ]);
    }
}
