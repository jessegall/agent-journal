<?php

declare(strict_types=1);

namespace Tests\Routes\Assignments;

use App\Assignments\AutoAssignmentChange;
use App\Assignments\Commands\ConfigureAutoAssignment\ConfigureAutoAssignmentCommand;
use App\Support\ActorReference;
use App\Support\AutoAssignmentInput;
use App\Support\AutoAssignmentKey;
use App\Support\PoolReference;
use Domain\Tasks\TasksDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner changes the pool an agent takes tasks from on its own.
 */
#[TestsRoute('POST', 'assignments.auto.configure')]
final class AutoConfigurePostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $builder = $journal->signedStart('Builder');

        return RouteCall::as(Caller::User)
            ->payload([
                'actorType' => 'agent',
                'actorId' => $builder->agent->id,
                'assignableType' => 'tasks.task',
                'pool' => 'tasks.open',
                'records' => [],
                'size' => 1,
                'expectedRevision' => 0,
                'target' => null,
            ])
            ->reply(ConfigureAutoAssignmentCommand::class, new AutoAssignmentChange(true, 1))
            ->expects(ConfigureAutoAssignmentCommand::class, [
                'input' => new AutoAssignmentInput(
                    new AutoAssignmentKey(ActorReference::of($builder->agent), 'tasks.task'),
                    new PoolReference('tasks.open', null, []),
                    1,
                ),
                'expectedRevision' => 0,
            ]);
    }
}
