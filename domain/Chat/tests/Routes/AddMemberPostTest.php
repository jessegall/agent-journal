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
 * The entry test of POST chat.add-member, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('POST', 'chat.add-member')]
final class AddMemberPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(ChatDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('POST chat.add-member', [
            'the payload',
            'the expected commands',
            'the ids of the recorded page request chat-add-member',
        ]);
    }
}
