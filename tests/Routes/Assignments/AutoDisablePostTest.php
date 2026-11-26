<?php

declare(strict_types=1);

namespace Tests\Routes\Assignments;

use App\Assignments\AutoAssignmentChange;
use App\Assignments\Commands\DisableAutoAssignment\DisableAutoAssignmentCommand;
use App\Support\ActorReference;
use App\Support\AutoAssignmentKey;
use Domain\Tasks\TasksDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner stops an agent taking tasks on its own.
 */
#[TestsRoute('POST', 'assignments.auto.disable')]
final class AutoDisablePostTest extends GuardedRouteEntryTestCase
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
                'expectedRevision' => 0,
            ])
            ->reply(DisableAutoAssignmentCommand::class, new AutoAssignmentChange(true, 1))
            ->expects(DisableAutoAssignmentCommand::class, [
                'key' => new AutoAssignmentKey(ActorReference::of($builder->agent), 'tasks.task'),
                'expectedRevision' => 0,
            ]);
    }
}
