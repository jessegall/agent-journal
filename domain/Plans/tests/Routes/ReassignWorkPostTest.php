<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Routes;

use App\Enums\Assignments\AssignmentOutcomeType;
use App\Support\AssigneeIdentity;
use App\Support\AssignmentOutcome;
use App\Support\AssignmentResult;
use App\Support\RecordIdentity;
use Domain\Plans\Commands\ReassignPlanWork\ReassignPlanWorkCommand;
use Domain\Plans\PlansDomain;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Illuminate\Support\Str;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner hands the work of a plan from one agent to another.
 */
#[TestsRoute('POST', 'plans.reassign-work')]
final class ReassignWorkPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $plan = $journal->owner()->fixtures(PlanFixtures::class)->createPlan('Release');
        $holder = $journal->signedStart('Builder');
        $reviewer = $journal->signedStart('Reviewer');
        $journal->actAs('Owner');
        $root = new RecordIdentity('plans.plan', $plan->id);

        return RouteCall::as(Caller::User)
            ->parameters(['plan' => $plan->number])
            ->payload([
                'recipient_type' => 'agent',
                'recipient_id' => $reviewer->agent->id,
                'expected_reference' => strtolower((string) Str::ulid()),
                'expected_holder_type' => 'agent',
                'expected_holder_id' => $holder->agent->id,
            ])
            ->reply(ReassignPlanWorkCommand::class, new AssignmentResult(
                [new AssignmentOutcome($root, null, AssignmentOutcomeType::Changed)],
                [],
            ))
            ->expects(ReassignPlanWorkCommand::class, [
                'root' => $root,
                'recipient' => new AssigneeIdentity('agent', $reviewer->agent->id),
            ]);
    }
}
