<?php

declare(strict_types=1);

namespace Tests\Commands\CommandRules;

use App\Commands\CommandRules\ApproveRuleProposal\ApproveRuleProposalCommand;
use App\Commands\CommandRules\RestoreCommandRule\RestoreCommandRuleCommand;
use App\Commands\CommandRules\RetireCommandRule\RetireCommandRuleCommand;
use App\Commands\CommandRules\SaveCommandRule\SaveCommandRuleCommand;
use App\Enums\CommandRules\ClassificationStatus;
use App\Enums\CommandRules\CommandClass;
use App\Enums\CommandRules\ProposalStatus;
use App\Models\CommandRules\ClassificationRule;
use App\Models\CommandRules\RuleProposal;
use App\Values\ApprovalReceipt;
use App\Values\ArgumentGrammar;
use App\Values\CommandClassSet;
use App\Values\CommandRule;
use App\Values\OwnerApproval;
use App\Values\ProgramSpellings;
use App\Values\RuleScope;
use Tests\Fixtures\Processes\AcmeDeclarations;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * A retired rule restored needs a new approval before it is active again.
 */
final class RestoreCommandRuleTest extends TestCase
{
    use RefreshHookDatabase;
    use RunsAcmeRequests;

    protected function setUp(): void
    {
        parent::setUp();

        $this->openAcmeRequest();
    }

    public function test_retire_then_restore_needs_a_new_approval(): void
    {
        $this->saveOrdinary('save-1', 0);
        $rule = ClassificationRule::query()->sole();

        $this->journal->actAsUserId(TestIds::of(7))->runUnkeyed(new RetireCommandRuleCommand($rule->id, 1, 'replaced by a script'));
        $this->assertSame(ClassificationStatus::Retired, $rule->refresh()->status);

        $restored = $this->journal->actAsUserId(TestIds::of(7))->runUnkeyed(new RestoreCommandRuleCommand($rule->id, 1, 1, 'restore-1'));
        $this->assertSame(ProposalStatus::Pending, $restored->state);
        $this->assertSame(ClassificationStatus::Retired, $rule->refresh()->status);

        $this->journal->actAsUserId(TestIds::of(7))->runUnkeyed(new ApproveRuleProposalCommand($restored->proposalId, new OwnerApproval(1, 1, [], 'back again')));
        $this->assertSame(ClassificationStatus::Active, $rule->refresh()->status);
        $this->assertSame(2, $rule->active_revision);
    }

    private function saveOrdinary(string $requestId, int $expectedActive): ApprovalReceipt
    {
        $rule = CommandRule::forProgram(
            'project.tidy.list',
            new ProgramSpellings('tidy'),
            ['list'],
            ArgumentGrammar::none(),
            CommandClassSet::of(CommandClass::Read),
        )->ownedBy(RuleScope::project(), 1);
        $proposed = AcmeDeclarations::proposed($rule);

        $save = new SaveCommandRuleCommand($requestId, $proposed, $expectedActive, 'reviewed');

        return $this->journal->actAsUserId(TestIds::of(7))->runUnkeyed($save);
    }

    private function proposalId(): string
    {
        return RuleProposal::query()->where('command_request_id', $this->requestId)->sole()->id;
    }
}
