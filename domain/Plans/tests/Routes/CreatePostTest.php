<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Routes;

use Domain\Plans\Commands\CreatePlan\CreatePlanCommand;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\PlansDomain;
use Illuminate\Support\Str;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent files a new plan.
 */
#[TestsRoute('POST', 'plans.create')]
final class CreatePostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Planner');

        return RouteCall::as(Caller::Agent, $start)
            ->payload([
                'title' => 'Release',
                'brief' => 'Ship version 6.',
                'type' => 'build',
                'request_key' => 'plans-1',
            ])
            ->reply(CreatePlanCommand::class, Str::ulid())
            ->expects(CreatePlanCommand::class, [
                'title' => 'Release',
                'brief' => 'Ship version 6.',
                'type' => PlanType::Build,
            ]);
    }
}
