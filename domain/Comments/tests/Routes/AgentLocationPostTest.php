<?php

declare(strict_types=1);

namespace Domain\Comments\Tests\Routes;

use Domain\Comments\CommentsDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of POST comments.agent.location, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('POST', 'comments.agent.location')]
final class AgentLocationPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(CommentsDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('POST comments.agent.location', [
            'the payload',
        ]);
    }
}
