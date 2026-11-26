<?php

declare(strict_types=1);

namespace Tests\Routes\Processes;

use App\Commands\CommandRules\RetireCommandRule\RetireCommandRuleCommand;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner retires the rule a request uses, at the revision they read, with their reason.
 */
#[TestsRoute('POST', 'processes.retire-rule')]
final class RetireRulePostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $ruleId = strtolower((string) Str::ulid());

        return RouteCall::as(Caller::User)
            ->parameters([
                'rule' => $ruleId,
            ])
            ->payload([
                'expected_revision' => 2,
                'reason' => 'It lets too much through.',
            ])
            ->reply(RetireCommandRuleCommand::class, $ruleId)
            ->expects(RetireCommandRuleCommand::class, [
                'classificationRuleId' => $ruleId,
                'expectedRevision' => 2,
                'reason' => 'It lets too much through.',
            ]);
    }
}
