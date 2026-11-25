<?php

declare(strict_types=1);

namespace Domain\Rules\Tests\Routes;

use Domain\Rules\RulesDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of PATCH rules.approve, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('PATCH', 'rules.approve')]
final class ApprovePatchTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(RulesDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('PATCH rules.approve', [
            '{rule}',
            'the payload',
            'the expected commands',
        ]);
    }
}
