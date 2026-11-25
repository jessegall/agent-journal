<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Routes;

use Domain\Documents\DocumentsDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of GET documents.revision, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('GET', 'documents.revision')]
final class RevisionGetTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(DocumentsDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('GET documents.revision', [
            '{document}',
            '{revision}',
        ]);
    }
}
