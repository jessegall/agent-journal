<?php

declare(strict_types=1);

namespace Tests\Commands\CommandRules;

use App\Commands\CommandRules\ApproveRuleProposal\ApproveRuleProposalCommand;
use App\Commands\CommandRules\ProveReader\ProveReaderCommand;
use App\Commands\CommandRules\SaveCommandRule\SaveCommandRuleCommand;
use App\Enums\CommandRules\ClassificationStatus;
use App\Enums\CommandRules\CommandClass;
use App\Enums\CommandRules\ProposalStatus;
use App\Enums\CommandRules\RequestStatus;
use App\Events\Processes\RuleActivated;
use App\Exceptions\ApprovalRefused;
use App\Exceptions\CommandAdmissionRefused;
use App\Models\CommandRules\ClassificationRule;
use App\Models\CommandRules\RuleProposal;
use App\Models\CommandRules\RuleRevision;
use App\Support\Projects\ProjectSelectionStore;
use App\Values\ArgumentGrammar;
use App\Values\CommandClassSet;
use App\Values\CommandRule;
use App\Values\OwnerApproval;
use App\Values\ProgramSpellings;
use App\Values\ProjectSelection;
use App\Values\ReaderApproval;
use App\Values\RuleScope;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Event;
use Tests\Fixtures\Processes\AcmeDeclarations;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * The owner approves a proven pair of declaration and reader and the rule is active; an agent cannot approve, and an
 * approval without a proof or with another reader's proof is refused.
 */
#[TestsCommand(ApproveRuleProposalCommand::class)]
final class ApproveRuleProposalTest extends TestCase
{
    use RefreshHookDatabase;
    use RunsAcmeRequests;

    protected function setUp(): void
    {
        parent::setUp();

        $this->openAcmeRequest();
    }

    public function test_the_owner_approves_the_proven_pair_and_the_rule_is_active(): void
    {
        Event::fake([RuleActivated::class]);
        [$reader, $proof] = $this->provenReader();

        $receipt = $this->journal->actAsUserId(TestIds::of(7))->runUnkeyed(
            new ApproveRuleProposalCommand($this->proposalId(), $this->approval($reader, $proof, 0)),
        );

        $this->assertSame('project.acme.verify', $receipt->ruleId);
        $this->assertSame(1, $receipt->revision);
        $rule = ClassificationRule::query()->sole();
        $this->assertSame(ClassificationStatus::Active, $rule->status);
        $revision = RuleRevision::query()->findOrFail($rule->active_revision_id);
        $this->assertSame([new ReaderApproval($reader, $proof)->toArray()], $revision->reader_approvals->toArray());
        $this->assertSame(RequestStatus::Active, $this->request()->status);
        $this->assertSame(ProposalStatus::Approved, RuleProposal::query()->sole()->status);
        Event::assertDispatched(RuleActivated::class);
    }

    public function test_an_agent_cannot_approve(): void
    {
        [$reader, $proof] = $this->provenReader();

        $approve = new ApproveRuleProposalCommand($this->proposalId(), $this->approval($reader, $proof, 0));

        $this->assertThrows(
            fn () => $this->journal->runAsStart($this->start, $approve),
            CommandAdmissionRefused::class,
        );
        $this->assertSame(0, ClassificationRule::query()->count());
    }

    public function test_approval_without_a_proof_or_with_another_readers_proof_is_refused(): void
    {
        [$reader, $proof] = $this->provenReader();
        $other = $this->reader();
        $without = new ApproveRuleProposalCommand($this->proposalId(), new OwnerApproval(1, 0, [], 'looks right'));
        $mismatched = new ApproveRuleProposalCommand($this->proposalId(), $this->approval($other, $proof, 0));

        $this->assertThrows(
            fn () => $this->journal->actAsUserId(TestIds::of(7))->runUnkeyed($without),
            ApprovalRefused::class,
        );
        $this->assertThrows(
            fn () => $this->journal->actAsUserId(TestIds::of(7))->runUnkeyed($mismatched),
            ApprovalRefused::class,
        );
        $this->assertSame(0, ClassificationRule::query()->count());
    }

    public function test_another_projects_proposal_is_not_found_under_a_selection_of_one_project(): void
    {
        $this->journal->project('Shop');
        $this->journal->actAsUserId(TestIds::of(7))->runUnkeyed(
            new SaveCommandRuleCommand('save-1', AcmeDeclarations::proposed($this->tidyRule()), 0, 'reviewed'),
        );
        $proposal = RuleProposal::query()->latest('id')->firstOrFail();
        $shop = ProjectSelection::of($this->journal->projectCalled('Shop')->id);

        $this->assertThrows(
            fn () => $this->app->make(ProjectSelectionStore::class)->within($shop, fn () => $this->journal->runUnkeyed(
                new ApproveRuleProposalCommand($proposal->id, new OwnerApproval(1, 0, [], 'b')),
            )),
            ModelNotFoundException::class,
        );
    }

    /**
     * @return array{0: string, 1: string}
     */
    private function provenReader(): array
    {
        $passed = $this->sample(0, self::PASSED_OUTPUT, isRead: true);
        $findings = $this->sample(1, self::FINDINGS_OUTPUT, isRead: true);
        $reader = $this->reader();

        return [
            $reader,
            $this->journal->runAsStart(
                $this->start,
                new ProveReaderCommand($this->requestId, $reader, [$passed, $findings]),
            ),
        ];
    }

    private function approval(string $reader, string $proof, int $expectedActive): OwnerApproval
    {
        return new OwnerApproval(1, $expectedActive, [new ReaderApproval($reader, $proof)], 'proven on real samples');
    }

    private function proposalId(): string
    {
        return RuleProposal::query()->where('command_request_id', $this->requestId)->sole()->id;
    }

    private function tidyRule(): CommandRule
    {
        return CommandRule::forProgram(
            'project.tidy.list',
            new ProgramSpellings('tidy'),
            ['list'],
            ArgumentGrammar::none(),
            CommandClassSet::of(CommandClass::Read),
        )->ownedBy(RuleScope::project(), 1);
    }
}
