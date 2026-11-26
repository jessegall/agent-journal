<?php

declare(strict_types=1);

namespace Domain\Sequences\Tests\Routes;

use Domain\Sequences\Commands\ChangeSequence\ChangeSequenceCommand;
use Domain\Sequences\Commands\DefineSequence\DefineSequenceCommand;
use Domain\Sequences\SequencesDomain;
use Domain\Sequences\Values\SequenceStep;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner changes the steps of a sequence at the version they opened.
 */
#[TestsRoute('PATCH', 'sequences.change-sequence')]
final class ChangeSequencePatchTest extends GuardedRouteEntryTestCase
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
        ]));

        return RouteCall::as(Caller::User)
            ->parameters([
                'sequence' => $sequenceId,
            ])
            ->payload([
                'name' => 'Release',
                'version' => 1,
            'steps' => [
                [
                    'id' => 'build',
                    'title' => 'Build',
                    'runs_when' => 'held',
                    'done_when' => 'green',
                ],
            ],
            ])
            ->expects(ChangeSequenceCommand::class, [
                'sequenceId' => $sequenceId,
                'openedVersion' => 1,
                'name' => 'Release',
                'steps' => [
                    new SequenceStep(id: 'build', title: 'Build', runsWhen: 'held', doneWhen: 'green'),
                ],
            ]);
    }
}
