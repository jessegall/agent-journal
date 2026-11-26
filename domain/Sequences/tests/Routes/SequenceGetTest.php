<?php

declare(strict_types=1);

namespace Domain\Sequences\Tests\Routes;

use Domain\Sequences\Commands\DefineSequence\DefineSequenceCommand;
use Domain\Sequences\SequencesDomain;
use Domain\Sequences\Values\SequenceStep;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\TestProjects;

/**
 * The owner opens a sequence's page.
 */
#[TestsRoute('GET', 'sequences.sequence')]
final class SequenceGetTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(SequencesDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();

        $sequenceId = $journal->run(new DefineSequenceCommand('Release', [
            new SequenceStep(id: 'build', title: 'Build', runsWhen: 'held', doneWhen: 'green'),
        ], TestProjects::localOwner()->key()));

        return RouteCall::as(Caller::User)
            ->parameters(['sequence' => $sequenceId]);
    }
}
