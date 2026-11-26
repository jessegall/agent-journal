<?php

declare(strict_types=1);

namespace Domain\Sequences\Tests\Routes;

use Domain\Sequences\SequencesDomain;
use Domain\Sequences\Tests\Fixtures\SequenceFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner opens a run of a sequence.
 */
#[TestsRoute('GET', 'sequences.run')]
final class RunGetTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(SequencesDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $run = $journal->fixtures(SequenceFixtures::class)->createRun('Release', [
            'Build',
            'Ship',
        ]);

        return RouteCall::as(Caller::User)
            ->parameters([
                'run' => $run->number,
            ]);
    }
}
