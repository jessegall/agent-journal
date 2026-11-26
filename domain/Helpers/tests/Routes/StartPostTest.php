<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Routes;

use Domain\Helpers\Commands\StartHelper\StartHelperCommand;
use Domain\Helpers\HelpersDomain;
use Domain\Helpers\Tests\Fixtures\HelperFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent starts a helper under a profile with its brief.
 */
#[TestsRoute('POST', 'helpers.start')]
final class StartPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(HelpersDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Planner');
        $helpers = $journal->fixtures(HelperFixtures::class)->openJob('Review', 'Planner', 'Review the change.');

        return RouteCall::as(Caller::Agent, $start)
            ->payload([
                'profile_key' => 'writing-helper',
                'model' => 'claude-sonnet-5-5',
                'driver_key' => null,
                'subject' => null,
                'purpose_id' => null,
                'purpose_text' => null,
                'brief' => 'Review the change.',
                'request_key' => 'helper-1',
            ])
            ->reply(StartHelperCommand::class, $helpers->receiptOf('Review'))
            ->expects(StartHelperCommand::class, [
                'profileKey' => 'writing-helper',
                'model' => 'claude-sonnet-5-5',
            ]);
    }
}
