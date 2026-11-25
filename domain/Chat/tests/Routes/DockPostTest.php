<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Routes;

use Domain\Chat\ChatDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of POST chat.dock, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('POST', 'chat.dock')]
final class DockPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(ChatDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('POST chat.dock', [
            'the payload',
            'the expected commands',
        ]);
    }
}
