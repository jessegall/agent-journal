<?php

declare(strict_types=1);

namespace Tests\Routes\Processes;

use App\CommandRules\Commands\RestoreCommandRule\RestoreCommandRuleCommand;
use App\CommandRules\Values\ProposalReceipt;
use App\CommandRules\Values\ProposedRule;
use App\Models\CommandRules\ClassificationRule;
use App\Models\CommandRules\RuleProposal;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner restores an earlier approved revision of the rule a request uses, as a new proposal.
 */
#[TestsRoute('POST', 'processes.restore-rule')]
final class RestoreRulePostTest extends GuardedRouteEntryTestCase
{
    use RunsAcmeRequests;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $this->openAcmeRequest();
        $this->approvePair();
        $rule = ClassificationRule::query()->sole();
        $proposal = RuleProposal::query()->sole();
        $proposed = new ProposedRule($proposal->revisions()->newestRevisionFirst()->firstOrFail()->payload, '', []);

        $journal->actAs('Owner');

        return RouteCall::as(Caller::User)
            ->parameters([
                'rule' => $rule->id,
            ])
            ->payload([
                'from_revision' => 1,
                'expected_revision' => 2,
                'request_id' => 'restore-1',
            ])
            ->reply(RestoreCommandRuleCommand::class, ProposalReceipt::of($proposal, $proposed))
            ->expects(RestoreCommandRuleCommand::class, [
                'classificationRuleId' => $rule->id,
                'fromRevision' => 1,
                'expectedRevision' => 2,
                'requestId' => 'restore-1',
            ]);
    }
}
