<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Routes;

use App\Http\Middleware\Web\SelectProject;
use Domain\Plans\Commands\CreatePlan\CreatePlanCommand;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\PlansDomain;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\TestProjects;

/**
 * The owner files a new plan and is sent to its page.
 */
#[TestsRoute('POST', 'plans.create-plan')]
final class CreatePlanPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        // The page answers with the new plan's address, so the reply is a plan that exists.
        $plan = $journal->owner()->fixtures(PlanFixtures::class)->createPlan('Release');

        return RouteCall::as(Caller::User)
            ->headers([SelectProject::HEADER => TestProjects::local()->id])
            ->payload([
                'title' => 'Release',
                'brief' => 'Ship version 6.',
                'type' => 'build',
            ])
            ->reply(CreatePlanCommand::class, $plan->id)
            ->expects(CreatePlanCommand::class, [
                'title' => 'Release',
                'brief' => 'Ship version 6.',
                'type' => PlanType::Build,
            ]);
    }
}
