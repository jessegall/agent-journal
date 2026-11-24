<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Enums\ActorType;
use App\Enums\ClassificationState;
use App\Enums\CommandClass;
use App\Enums\CommandType;
use App\Enums\ProposalState;
use App\Enums\ToolType;
use App\Exceptions\ClassificationRuleRefused;
use App\Exceptions\RevisionImmutable;
use App\Exceptions\RuleProposalRefused;
use App\Exceptions\RuleRevisionInvalid;
use App\Models\CommandRules\ClassificationRule;
use App\Models\CommandRules\RuleProposal;
use App\Models\CommandRules\RuleProposalRevision;
use App\Models\CommandRules\RuleRevision;
use App\Support\ActorIdentity;
use App\Support\RuleProposals;
use App\Values\ArgumentGrammar;
use App\Values\CommandClassSet;
use App\Values\CommandRule;
use App\Values\ProgramSpellings;
use App\Values\ProposedRule;
use App\Values\ReaderApproval;
use App\Values\RuleExample;
use App\Values\RuleReference;
use App\Values\RuleScope;
use App\Values\ScriptBinding;
use Tests\Support\ChecksSchemaTables;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Proposals, their revisions, approved rule revisions and the active rule pointer are versioned project records
 *.
 */
final class RuleRecordsTest extends TestCase
{
    use ChecksSchemaTables;
    use RefreshHookDatabase;

    private const string RETIREMENT_REASON = 'no longer used';

    private const string OPERATION = 'acme status';

    private const string PROJECT = 'acme-project';

    protected static function storedTables(): array
    {
        return ['rule_proposals', 'rule_proposal_revisions', 'rule_revisions', 'classification_rules'];
    }

    public function test_the_same_request_id_and_payload_is_the_same_proposal_and_another_payload_is_refused(): void
    {
        $first = $this->open('request-1', $this->complete($this->statusRule()));
        $again = $this->open('request-1', $this->complete($this->statusRule()));

        $this->assertSame($first->id, $again->id);
        $this->assertSame(1, RuleProposal::query()->ofProject(self::PROJECT)->count());
        $this->assertThrows(
            fn () => $this->open('request-1', new ProposedRule($this->statusRule(), 'other evidence', [])),
            RuleProposalRefused::class,
        );
    }

    public function test_a_complete_revision_waits_for_review_and_an_incomplete_one_stays_a_draft(): void
    {
        $pending = $this->open('request-1', $this->complete($this->statusRule()));
        $draft = $this->open('request-2', new ProposedRule($this->statusRule(), '', [RuleExample::negative('acme x')]));

        $this->assertSame(ProposalState::Pending, $pending->refresh()->state);
        $this->assertSame(ProposalState::Draft, $draft->refresh()->state);
        $this->assertSame(1, $pending->current_revision);
        $this->assertSame(self::OPERATION, $pending->operation);
        $this->assertSame('acme', $pending->program);
        $this->assertEquals(RuleScope::project(), $pending->scope);
    }

    public function test_a_proposal_revision_stores_the_typed_rule_with_its_contract_and_examples(): void
    {
        $rule = $this->checkRule();
        $proposed = $this->complete($rule);
        $proposal = $this->open('request-1', $proposed);

        $revision = RuleProposalRevision::query()->ofProject(self::PROJECT)->where('rule_proposal_id', $proposal->id)
            ->firstOrFail();

        $this->assertEquals($rule, $revision->payload);
        $this->assertSame($rule->digest(), $revision->payload->digest());
        $this->assertEquals($proposed->examples, $revision->examples);
        $this->assertCount(1, $revision->payload->contracts);
    }

    public function test_a_proposal_revision_is_never_updated(): void
    {
        $proposal = $this->open('request-1', $this->complete($this->statusRule()));
        $revision = RuleProposalRevision::query()->ofProject(self::PROJECT)->where('rule_proposal_id', $proposal->id)
            ->firstOrFail();

        $revision->evidence = 'changed';

        $this->assertThrows(fn () => $revision->save(), RevisionImmutable::class);
    }

    public function test_an_ended_proposal_takes_no_new_revision(): void
    {
        $proposal = $this->open('request-1', $this->complete($this->statusRule()));
        $proposal->state = ProposalState::Withdrawn;
        $proposal->save();

        $this->assertThrows(
            fn () => $this->app->make(RuleProposals::class)->revise(
                $proposal,
                1,
                $this->complete($this->statusRule()),
                $this->agent(),
            ),
            RuleProposalRefused::class,
        );
    }

    public function test_an_approved_revision_cannot_be_updated(): void
    {
        $revision = $this->approve($this->statusRule(), []);

        $this->assertSame(1, $revision->revision);
        $this->assertSame($revision->payload->digest(), $revision->digest);
        $this->assertSame('user', $revision->approver_type);

        $revision->digest = str_repeat('0', 64);

        $this->assertThrows(fn () => $revision->save(), RevisionImmutable::class);
    }

    public function test_the_purpose_decides_whether_an_approval_names_a_reader(): void
    {
        $reader = new ReaderApproval('reader-revision-1', 'proof-1');

        $check = $this->approve($this->checkRule(), [$reader]);

        $this->assertEquals([$reader], $check->refresh()->reader_approvals);
        $this->assertThrows(fn () => $this->approve($this->checkRule(), []), RuleRevisionInvalid::class);
        $this->assertThrows(fn () => $this->approve($this->statusRule(), [$reader]), RuleRevisionInvalid::class);
    }

    public function test_script_bindings_and_replacement_targets_are_stored_typed(): void
    {
        $script = new ScriptBinding('package.json', 'test', str_repeat('b', 64));
        $replaced = new RuleReference(RuleScope::module('acme', '2.0'), 'module.acme.status', 3);
        $rule = $this->statusRule()->replacing($replaced);

        $proposal = $this->open('request-1', $this->complete($rule));
        $proposed = $proposal->revisions()->firstOrFail();
        $revision = RuleRevision::create($proposed, self::PROJECT, $this->user(), [], [$script]);

        $this->assertEquals([$replaced], $proposal->refresh()->replaces);
        $this->assertEquals([$script], $revision->refresh()->script_bindings);
    }

    public function test_the_rule_activates_retires_and_restores_only_from_the_expected_revision(): void
    {
        $first = $this->approve($this->statusRule(), []);
        $second = $this->approve($this->statusRule(), []);

        $rule = ClassificationRule::forRule(self::PROJECT, $first->payload);
        $rule->activate($first, 0);
        $this->assertThrows(fn () => $rule->activate($second, 0), ClassificationRuleRefused::class);
        $rule->activate($second, 1);
        $this->assertThrows(fn () => $rule->activate($first, 2), ClassificationRuleRefused::class);

        $rule->retire(2, self::RETIREMENT_REASON);
        $this->assertSame(ClassificationState::Retired, $rule->refresh()->state);
        $this->assertSame(self::RETIREMENT_REASON, $rule->state_reason);
        $this->assertThrows(fn () => $rule->retire(2, 'again'), ClassificationRuleRefused::class);

        $rule->restoreFrom($first, 2);
        $rule->refresh();
        $this->assertSame(ClassificationState::Active, $rule->state);
        $this->assertSame($first->id, $rule->active_revision_id);
        $this->assertSame(1, $rule->active_revision);
        $this->assertSame($rule->id, ClassificationRule::forRule(self::PROJECT, $second->payload)->id);
    }

    public function test_a_revision_of_another_rule_is_refused(): void
    {
        $status = $this->approve($this->statusRule(), []);
        $check = $this->approve($this->checkRule(), [new ReaderApproval('reader-revision-1', 'proof-1')]);

        $rule = ClassificationRule::forRule(self::PROJECT, $status->payload);
        $rule->activate($status, 0);

        $this->assertThrows(fn () => $rule->activate($check, 1), ClassificationRuleRefused::class);
    }

    public function test_another_project_key_sees_no_row(): void
    {
        $revision = $this->approve($this->statusRule(), []);
        ClassificationRule::forRule(self::PROJECT, $revision->payload)->activate($revision, 0);

        $this->assertSame(0, RuleProposal::query()->ofProject('other-project')->count());
        $this->assertSame(0, RuleProposalRevision::query()->ofProject('other-project')->count());
        $this->assertSame(0, RuleRevision::query()->ofProject('other-project')->count());
        $this->assertSame(0, ClassificationRule::query()->ofProject('other-project')->count());
        $this->assertSame(1, ClassificationRule::query()->ofProject(self::PROJECT)->count());
    }

    /**
     * @param  list<ReaderApproval>  $readers
     */
    private function approve(CommandRule $rule, array $readers): RuleRevision
    {
        $proposal = $this->open('request-'.RuleProposal::query()->count(), $this->complete($rule));

        return RuleRevision::create($proposal->revisions()->firstOrFail(), self::PROJECT, $this->user(), $readers, []);
    }

    private function open(string $requestId, ProposedRule $proposed): RuleProposal
    {
        return $this->app->make(RuleProposals::class)->open(self::PROJECT, $this->agent(), $requestId, $proposed, null);
    }

    private function complete(CommandRule $rule): ProposedRule
    {
        return new ProposedRule($rule, 'acme --help lists status as read-only', [
            RuleExample::positive(self::OPERATION, CommandClassSet::of(CommandClass::Read)),
            RuleExample::negative('acme status --write'),
        ]);
    }

    private function statusRule(): CommandRule
    {
        return CommandRule::forProgram(
            'project.acme.status',
            new ProgramSpellings('acme'),
            ['status'],
            ArgumentGrammar::none(),
            CommandClassSet::of(CommandClass::Read),
        )->ownedBy(RuleScope::project(), 1);
    }

    private function checkRule(): CommandRule
    {
        return CommandRule::forCheck(
            'project.acme.verify',
            new ProgramSpellings('acme', ['acme-cli']),
            ['verify'],
            ArgumentGrammar::options(['--all']),
            CommandClassSet::of(CommandClass::Read),
            CommandType::Verification,
            ToolType::Other,
        )->ownedBy(RuleScope::project(), 1);
    }

    private function agent(): ActorIdentity
    {
        return new ActorIdentity(ActorType::Agent, '01jd8x0g9m3qz6v4k2t7r5w1ce');
    }

    private function user(): ActorIdentity
    {
        return new ActorIdentity(ActorType::User, '01jd8x0g9m3qz6v4k2t7r5w1cf');
    }
}
