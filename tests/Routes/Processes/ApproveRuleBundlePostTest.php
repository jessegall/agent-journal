<?php

declare(strict_types=1);

namespace Tests\Routes\Processes;

use App\CommandRules\Commands\ApproveRuleBundle\ApproveRuleBundleCommand;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner approves the rule bundle a module ships, by its digest.
 */
#[TestsRoute('POST', 'processes.approve-rule-bundle')]
final class ApproveRuleBundlePostTest extends GuardedRouteEntryTestCase
{
    use RunsAcmeRequests;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $digest = str_repeat('a', 64);

        return RouteCall::as(Caller::User)
            ->payload([
                'module' => 'acme',
                'version' => '1.0.0',
                'digest' => $digest,
            ])
            ->reply(ApproveRuleBundleCommand::class, strtolower((string) Str::ulid()))
            ->expects(ApproveRuleBundleCommand::class, [
                'module' => 'acme',
                'version' => '1.0.0',
                'digest' => $digest,
            ]);
    }
}
