<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Actors\Exceptions\UserActorRequired;
use App\Processes\Commands\ApproveRuleProposal;
use App\Processes\Commands\ProveReader;
use App\Processes\Commands\RejectRuleProposal;
use App\Processes\Commands\RestoreCommandRule;
use App\Processes\Commands\RetireCommandRule;
use App\Processes\Commands\SaveCommandRule;
use App\Processes\Enums\ClassificationState;
use App\Processes\Enums\CommandClass;
use App\Processes\Enums\ProposalState;
use App\Processes\Enums\RequestState;
use App\Processes\Events\RuleActivated;
use App\Processes\Events\RuleRejected;
use App\Processes\Exceptions\ApprovalRefused;
use App\Processes\Exceptions\ClassificationRuleRefused;
use App\Processes\Models\ClassificationRule;
use App\Processes\Models\RuleProposal;
use App\Processes\Models\RuleRevision;
use App\Processes\Values\ApprovalReceipt;
use App\Processes\Values\ArgumentGrammar;
use App\Processes\Values\CommandClassSet;
use App\Processes\Values\CommandRule;
use App\Processes\Values\OwnerApproval;
use App\Processes\Values\ProgramSpellings;
use App\Processes\Values\ReaderApproval;
use App\Processes\Values\RuleScope;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Event;
use Tests\Fixtures\Processes\AcmeDeclarations;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\SendsSignedCalls;
use Tests\TestCase;

/**
 * A project owner approves a proven declaration and reader pair in one transaction, and rejects, retires and restores
 * declarations; an agent can do none of it (doc 21 revision 6, sections 51, 55, 71 and 72; stories 45, 47, 48, 81-83,
 * 85, 86, 91, 95, 96, 186, 187, 189 and 191).
 */
final class RuleApprovalTest extends TestCase
{
    use RefreshHookDatabase;
    use RunsAcmeRequests;
    use SendsSignedCalls;

    protected function setUp(): void
    {
        parent::setUp();

        $this->openAcmeRequest();
    }

    public function test_the_owner_approves_the_proven_pair_and_the_rule_is_active(): void
    {
        Event::fake([RuleActivated::class]);
        [$reader, $proof] = $this->provenReader();

        $receipt = $this->asUser(new ApproveRuleProposal($this->proposalId(), $this->approval($reader, $proof, 0)));

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

        $approve = new ApproveRuleProposal($this->proposalId(), $this->approval($reader, $proof, 0));

        $this->assertThrows(fn () => $this->asAgent($approve), UserActorRequired::class);
        $this->assertSame(0, ClassificationRule::query()->count());
    }

    public function test_approval_without_a_proof_or_with_another_readers_proof_is_refused(): void
    {
        [$reader, $proof] = $this->provenReader();
        $other = $this->reader();
        $without = new ApproveRuleProposal($this->proposalId(), new OwnerApproval(1, 0, [], 'looks right'));
        $mismatched = new ApproveRuleProposal($this->proposalId(), $this->approval($other, $proof, 0));

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
            $this->assertStringContainsString('is at revision 1', $refusal->getMessage());
        }
        $this->assertSame(2, $this->saveOrdinary('save-3', 1)->revision);
    }

    public function test_a_rejection_leaves_the_request_rejected_and_tells_the_author(): void
    {
        Event::fake([RuleRejected::class]);

        $this->asUser(new RejectRuleProposal($this->proposalId(), 'effects are wider than read'));

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

        $this->asUser(new RetireCommandRule($rule->id, 1, 'replaced by a script'));
        $this->assertSame(ClassificationState::Retired, $rule->refresh()->state);

        $restored = $this->asUser(new RestoreCommandRule($rule->id, 1, 1, 'restore-1'));
        $this->assertSame(ProposalState::Pending, $restored->state);
        $this->assertSame(ClassificationState::Retired, $rule->refresh()->state);

        $this->asUser(new ApproveRuleProposal($restored->proposalId, new OwnerApproval(1, 1, [], 'back again')));
        $this->assertSame(ClassificationState::Active, $rule->refresh()->state);
        $this->assertSame(2, $rule->active_revision);
    }

    public function test_saving_a_check_without_a_request_is_refused(): void
    {
        $save = new SaveCommandRule('save-1', AcmeDeclarations::proposedVerify(), 0, 'trusted');

        $this->assertThrows(fn () => $this->asUser($save), ApprovalRefused::class);
        $this->assertThrows(
            fn () => $this->asUser(new RejectRuleProposal('no-such-proposal', 'none')),
            ModelNotFoundException::class,
        );
        $this->assertThrows(
            fn () => $this->asAgent(new RejectRuleProposal($this->proposalId(), 'agents cannot')),
            UserActorRequired::class,
        );
        $this->assertSame(ProposalState::Pending, RuleProposal::query()->sole()->state);
    }

    /**
     * @return array{0: string, 1: string}
     */
    private function provenReader(): array
    {
        $passed = $this->sample(0, self::PASSED_OUTPUT, read: true);
        $findings = $this->sample(1, self::FINDINGS_OUTPUT, read: true);
        $reader = $this->reader();

        return [$reader, $this->asAgent(new ProveReader($this->requestId, $reader, [$passed, $findings]))];
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

        $save = new SaveCommandRule($requestId, $proposed, $expectedActive, 'reviewed');

        return $this->asUser($save);
    }

    private function proposalId(): string
    {
        return RuleProposal::query()->where('command_request_id', $this->requestId)->sole()->id;
    }
}
