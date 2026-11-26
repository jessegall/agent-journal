<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Routes;

use Domain\Helpers\Commands\SteerHelper\SteerHelperCommand;
use Domain\Helpers\HelpersDomain;
use Domain\Helpers\Tests\Fixtures\HelperFixtures;
use Domain\Helpers\Values\SteerReceipt;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent steers one of its helpers with a line of text.
 */
#[TestsRoute('POST', 'helpers.steer')]
final class SteerPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(HelpersDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Planner');
        $helpers = $journal->fixtures(HelperFixtures::class)->openJob('Review', 'Planner', 'Review the change.');
        $job = $helpers->jobCalled('Review');
        $identity = $helpers->identityOf('Review');

        return RouteCall::as(Caller::Agent, $start)
            ->payload([
                'identity_id' => $identity->id,
                'text' => 'Look at the tests too.',
                'request_key' => 'helper-1',
            ])
            ->reply(SteerHelperCommand::class, SteerReceipt::steered($job->id))
            ->expects(SteerHelperCommand::class, [
                'identityId' => $identity->id,
                'text' => 'Look at the tests too.',
            ]);
    }
}
