<?php

declare(strict_types=1);

namespace Tests\Routes\Processes;

use App\Commands\CommandRules\RestoreCommandRule\RestoreCommandRuleCommand;
use App\Models\CommandRules\RuleProposal;
use App\Models\CommandRules\RuleRevision;
use App\Values\ProposalReceipt;
use Tests\Fixtures\Processes\AcmeDeclarations;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent proposes to restore an earlier revision of an approved rule.
 */
#[TestsRoute('POST', 'processes.agent.rules.restore')]
final class AgentRulesRestorePostTest extends GuardedRouteEntryTestCase
{
    use RunsAcmeRequests;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $this->openAcmeRequest();
        $this->approvePair();
        $ruleId = RuleRevision::query()->sole()->rule_id;
        $receipt = ProposalReceipt::of(RuleProposal::query()->sole(), AcmeDeclarations::proposedVerify());

        return RouteCall::as(Caller::Agent, $this->start)
            ->parameters([
                'rule' => $ruleId,
            ])
            ->payload([
                'from_revision' => 1,
                'expected_revision' => 1,
                'request_key' => 'restore-1',
            ])
            ->reply(RestoreCommandRuleCommand::class, $receipt)
            ->expects(RestoreCommandRuleCommand::class, [
                'classificationRuleId' => $ruleId,
                'fromRevision' => 1,
                'expectedRevision' => 1,
                'requestId' => 'restore-1',
            ]);
    }
}
