<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Routes;

use Domain\Helpers\Commands\ContinueHelper\ContinueHelperCommand;
use Domain\Helpers\HelpersDomain;
use Domain\Helpers\Tests\Fixtures\HelperFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent continues a helper's job with a model.
 */
#[TestsRoute('POST', 'helpers.continue')]
final class ContinuePostTest extends GuardedRouteEntryTestCase
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
                'job_id' => $job->id,
                'model' => 'claude-sonnet-5-5',
                'driver_key' => null,
                'request_key' => 'helper-1',
            ])
            ->reply(ContinueHelperCommand::class, $helpers->receiptOf('Review'))
            ->expects(ContinueHelperCommand::class, ['identityId' => $identity->id, 'jobId' => $job->id]);
    }
}
