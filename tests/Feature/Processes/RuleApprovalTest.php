<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Commands\ApproveRuleProposal\ApproveRuleProposalCommand;
use App\Commands\ProveReader\ProveReaderCommand;
use App\Commands\RejectRuleProposal\RejectRuleProposalCommand;
use App\Commands\RestoreCommandRule\RestoreCommandRuleCommand;
use App\Commands\RetireCommandRule\RetireCommandRuleCommand;
use App\Commands\SaveCommandRule\SaveCommandRuleCommand;
use App\Enums\ClassificationState;
use App\Enums\CommandClass;
use App\Enums\ProposalState;
use App\Enums\RequestState;
use App\Events\RuleActivated;
use App\Events\RuleRejected;
use App\Exceptions\ApprovalRefused;
use App\Exceptions\ClassificationRuleRefused;
use App\Exceptions\CommandAdmissionRefused;
use App\Models\CommandRules\ClassificationRule;
use App\Models\CommandRules\RuleProposal;
use App\Models\CommandRules\RuleRevision;
use App\Values\ApprovalReceipt;
use App\Values\ArgumentGrammar;
use App\Values\CommandClassSet;
use App\Values\CommandRule;
use App\Values\OwnerApproval;
use App\Values\ProgramSpellings;
use App\Values\ReaderApproval;
use App\Values\RuleScope;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Event;
use Tests\Fixtures\Processes\AcmeDeclarations;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\SendsSignedCalls;
use Tests\TestCase;

/**
 * A project owner approves a proven declaration and reader pair in one transaction, and rejects, retires and restores
 * declarations; an agent can do none of it.
 */
final class RuleApprovalTest extends TestCase
{
    use RefreshHookDatabase;
    use RunsAcmeRequests;
    use SendsSignedCalls;

    private const string AT_REVISION = 'is at revision 1';

    protected function setUp(): void
    {
        parent::setUp();

        $this->openAcmeRequest();
    }

    public function test_the_owner_approves_the_proven_pair_and_the_rule_is_active(): void
    {
        Event::fake([RuleActivated::class]);
        [$reader, $proof] = $this->provenReader();

        $receipt = $this->asUser(new ApproveRuleProposalCommand($this->proposalId(), $this->approval($reader, $proof, 0)));

        $this->assertSame('project.acme.verify', $receipt->ruleId);
        $this->assertSame(1, $receipt->revision);
        $rule = ClassificationRule::query()->sole();
        $this->assertSame(ClassificationState::Active, $rule->state);
        $revision = RuleRevision::query()->findOrFail($rule->active_revision_id);
        $this->assertEquals([new ReaderApproval($reader, $proof)], $revision->reader_approvals);
        $this->assertSame(RequestState::Active, $this->request()->state);
        $this->assertSame(ProposalState::Approved, RuleProposal::query()->sole()->state);
        Event::assertDispatched(RuleActivated::class);
    }

    public function test_an_agent_cannot_approve(): void
    {
        [$reader, $proof] = $this->provenReader();

        $approve = new ApproveRuleProposalCommand($this->proposalId(), $this->approval($reader, $proof, 0));

        $this->assertThrows(fn () => $this->runAsAgent($approve), CommandAdmissionRefused::class);
        $this->assertSame(0, ClassificationRule::query()->count());
    }

    public function test_approval_without_a_proof_or_with_another_readers_proof_is_refused(): void
    {
        [$reader, $proof] = $this->provenReader();
        $other = $this->reader();
        $without = new ApproveRuleProposalCommand($this->proposalId(), new OwnerApproval(1, 0, [], 'looks right'));
        $mismatched = new ApproveRuleProposalCommand($this->proposalId(), $this->approval($other, $proof, 0));

        $this->assertThrows(fn () => $this->asUser($without), ApprovalRefused::class);
        $this->assertThrows(fn () => $this->asUser($mismatched), ApprovalRefused::class);
        $this->assertSame(0, ClassificationRule::query()->count());
    }

    public function test_a_second_approval_on_the_same_base_fails_naming_the_active_revision(): void
    {
        $first = $this->saveOrdinary('save-1', 0);
        $this->assertSame(1, $first->revision);

        try {
            $this->saveOrdinary('save-2', 0);
            $this->fail('The second approval on the same base was accepted.');
        } catch (ClassificationRuleRefused $refusal) {
            $this->assertStringContainsString(self::AT_REVISION, $refusal->getMessage());
        }

        $this->assertSame(2, $this->saveOrdinary('save-3', 1)->revision);
    }

    public function test_a_rejection_leaves_the_request_rejected_and_tells_the_author(): void
    {
        Event::fake([RuleRejected::class]);

        $this->asUser(new RejectRuleProposalCommand($this->proposalId(), 'effects are wider than read'));

        $this->assertSame(RequestState::Rejected, $this->request()->state);
        $this->assertSame(ProposalState::Rejected, RuleProposal::query()->sole()->state);
        Event::assertDispatched(
            RuleRejected::class,
            fn (RuleRejected $rejected) => $rejected->reason === 'effects are wider than read',
        );
        $this->assertSame(0, ClassificationRule::query()->count());
    }

    public function test_retire_then_restore_needs_a_new_approval(): void
    {
        $this->saveOrdinary('save-1', 0);
        $rule = ClassificationRule::query()->sole();

        $this->asUser(new RetireCommandRuleCommand($rule->id, 1, 'replaced by a script'));
        $this->assertSame(ClassificationState::Retired, $rule->refresh()->state);

        $restored = $this->asUser(new RestoreCommandRuleCommand($rule->id, 1, 1, 'restore-1'));
        $this->assertSame(ProposalState::Pending, $restored->state);
        $this->assertSame(ClassificationState::Retired, $rule->refresh()->state);

        $this->asUser(new ApproveRuleProposalCommand($restored->proposalId, new OwnerApproval(1, 1, [], 'back again')));
        $this->assertSame(ClassificationState::Active, $rule->refresh()->state);
        $this->assertSame(2, $rule->active_revision);
    }

    public function test_saving_a_check_without_a_request_is_refused(): void
    {
        $save = new SaveCommandRuleCommand('save-1', AcmeDeclarations::proposedVerify(), 0, 'trusted');

        $this->assertThrows(fn () => $this->asUser($save), ApprovalRefused::class);
        $this->assertThrows(
            fn () => $this->asUser(new RejectRuleProposalCommand('no-such-proposal', 'none')),
            ModelNotFoundException::class,
        );
        $this->assertThrows(
            fn () => $this->runAsAgent(new RejectRuleProposalCommand($this->proposalId(), 'agents cannot')),
            CommandAdmissionRefused::class,
        );
        $this->assertSame(ProposalState::Pending, RuleProposal::query()->sole()->state);
    }

    /**
     * @return array{0: string, 1: string}
     */
    private function provenReader(): array
    {
        $passed = $this->sample(0, self::PASSED_OUTPUT, isRead: true);
        $findings = $this->sample(1, self::FINDINGS_OUTPUT, isRead: true);
        $reader = $this->reader();

        return [$reader, $this->runAsAgent(new ProveReaderCommand($this->requestId, $reader, [$passed, $findings]))];
    }

    private function approval(string $reader, string $proof, int $expectedActive): OwnerApproval
    {
        return new OwnerApproval(1, $expectedActive, [new ReaderApproval($reader, $proof)], 'proven on real samples');
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

        return $this->asUser($save);
    }

    private function proposalId(): string
    {
        return RuleProposal::query()->where('command_request_id', $this->requestId)->sole()->id;
    }
}
