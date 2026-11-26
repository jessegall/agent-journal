<?php

declare(strict_types=1);

namespace Tests\Routes\Processes;

use App\Commands\CommandRules\RetireCommandRule\RetireCommandRuleCommand;
use App\Models\CommandRules\RuleRevision;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent retires an approved rule at the revision it read, with its reason.
 */
#[TestsRoute('POST', 'processes.agent.rules.retire')]
final class AgentRulesRetirePostTest extends GuardedRouteEntryTestCase
{
    use RunsAcmeRequests;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $this->openAcmeRequest();
        $this->approvePair();
        $ruleId = RuleRevision::query()->sole()->rule_id;

        return RouteCall::as(Caller::Agent, $this->start)
            ->parameters([
                'rule' => $ruleId,
            ])
            ->payload([
                'expected_revision' => 1,
                'reason' => 'No longer used.',
                'request_key' => 'retire-1',
            ])
            ->reply(RetireCommandRuleCommand::class, $ruleId)
            ->expects(RetireCommandRuleCommand::class, [
                'classificationRuleId' => $ruleId,
                'expectedRevision' => 1,
                'reason' => 'No longer used.',
            ]);
    }
}
