<?php

declare(strict_types=1);

namespace Domain\Sequences\Tests\Routes;

use Domain\Sequences\Commands\DefineSequence\DefineSequenceCommand;
use Domain\Sequences\SequencesDomain;
use Domain\Sequences\Values\SequenceStep;
use Illuminate\Support\Str;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner defines a new sequence of steps.
 */
#[TestsRoute('POST', 'sequences.define-sequence')]
final class DefineSequencePostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(SequencesDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();

        return RouteCall::as(Caller::User)
            ->payload([
                'name' => 'Release',
                'steps' => [
                    [
                        'id' => 'build',
                        'title' => 'Build',
                        'runs_when' => 'held',
                        'done_when' => 'green',
                    ],
                ],
            ])
            ->reply(DefineSequenceCommand::class, Str::ulid())
            ->expects(DefineSequenceCommand::class, [
                'name' => 'Release',
                'steps' => [
                    new SequenceStep(id: 'build', title: 'Build', runsWhen: 'held', doneWhen: 'green'),
                ],
            ]);
    }
}
