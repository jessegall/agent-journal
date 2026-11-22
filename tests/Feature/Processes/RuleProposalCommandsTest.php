<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Processes\Commands\ImportRuleProposals\ImportRuleProposalsCommand;
use App\Processes\Commands\OpenCommandRequest\OpenCommandRequestCommand;
use App\Processes\Commands\ProposeCommandRule\ProposeCommandRuleCommand;
use App\Processes\Commands\ReviseRuleProposal\ReviseRuleProposalCommand;
use App\Processes\Commands\WithdrawRuleProposal\WithdrawRuleProposalCommand;
use App\Processes\Enums\CommandClass;
use App\Processes\Enums\CommandType;
use App\Processes\Enums\ProposalState;
use App\Processes\Enums\RequestHoldReason;
use App\Processes\Enums\RequestState;
use App\Processes\Enums\ToolType;
use App\Processes\Exceptions\DeclarationInvalid;
use App\Processes\Exceptions\RuleProposalRefused;
use App\Processes\Models\ClassificationRule;
use App\Processes\Models\CommandRequest;
use App\Processes\Models\RuleProposal;
use App\Processes\Models\RuleRevision;
use App\Processes\Support\CommandRuleRegistry;
use App\Processes\Values\ArgumentGrammar;
use App\Processes\Values\CommandClassSet;
use App\Processes\Values\CommandRule;
use App\Processes\Values\ProgramSpellings;
use App\Processes\Values\ProposalReceipt;
use App\Processes\Values\ProposedRule;
use App\Processes\Values\RuleExample;
use App\Processes\Values\RuleScope;
use Tests\Fixtures\Processes\AcmeDeclarations;
use Tests\Support\ActsAsActors;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Agents propose, revise and withdraw their own declarations through the bus, and a declaration file imports as
 * proposals only (doc 21 revision 6, sections 51 and 71; stories 79, 80, 83, 84, 87, 90, 94 and 180).
 */
final class RuleProposalCommandsTest extends TestCase
{
    use ActsAsActors;
    use RefreshHookDatabase;

    private const string FOLDER = '/projects/acme';

    public function test_a_complete_proposal_waits_for_review_and_moves_the_request_on_without_activating(): void
    {
        $request = $this->openRequest('agent-1', RequestHoldReason::UnknownCommand);

        $receipt = $this->propose('agent-1', $request, 'request-1', AcmeDeclarations::proposedVerify());

        $this->assertSame(ProposalState::Pending, $receipt->state);
        $this->assertSame([], $receipt->missingFields);
        $this->assertSame(RequestState::AwaitingSampleApproval, CommandRequest::query()->findOrFail($request)->state);
        $this->assertSame(0, ClassificationRule::query()->count());
        $this->assertSame(0, RuleRevision::query()->count());
    }

    public function test_a_proposal_without_its_exit_policy_stays_a_draft_naming_the_field(): void
    {
        $request = $this->openRequest('agent-1', RequestHoldReason::UnknownCommand);
        $unproven = CommandRule::forCheck(
            'project.acme.verify',
            new ProgramSpellings('acme'),
            ['verify'],
            ArgumentGrammar::none(),
            CommandClassSet::of(CommandClass::Read),
            CommandType::Verification,
            ToolType::Other,
        )->ownedBy(RuleScope::project(), 1);

        $receipt = $this->propose('agent-1', $request, 'request-1', AcmeDeclarations::proposed($unproven));

        $this->assertSame(ProposalState::Draft, $receipt->state);
        $this->assertSame(['contracts.0.exits'], $receipt->missingFields);
        $this->assertSame(RequestState::CollectingDeclaration, CommandRequest::query()->findOrFail($request)->state);
    }

    public function test_a_command_known_as_a_check_cannot_be_relabelled_as_ordinary(): void
    {
        $ordinary = AcmeDeclarations::proposed($this->ordinary());
        $readerRequest = $this->openRequest('agent-1', RequestHoldReason::ReaderRequired);
        $this->assertThrows(
            fn () => $this->propose('agent-1', $readerRequest, 'request-1', $ordinary),
            RuleProposalRefused::class,
        );

        $this->app->instance(CommandRuleRegistry::class, CommandRuleRegistry::from([AcmeDeclarations::verify()]));
        $unknownRequest = $this->openRequest('agent-2', RequestHoldReason::UnknownCommand);
        $this->assertThrows(
            fn () => $this->propose('agent-2', $unknownRequest, 'request-2', $ordinary),
            RuleProposalRefused::class,
        );
        $this->assertSame(0, RuleProposal::query()->count());
    }

    public function test_the_same_request_id_makes_no_duplicate_and_another_payload_is_refused(): void
    {
        $request = $this->openRequest('agent-1', RequestHoldReason::UnknownCommand);

        $first = $this->propose('agent-1', $request, 'request-1', AcmeDeclarations::proposedVerify());
        $again = $this->propose('agent-1', $request, 'request-1', AcmeDeclarations::proposedVerify());

        $this->assertSame($first->proposalId, $again->proposalId);
        $this->assertSame(1, RuleProposal::query()->count());
        $other = new ProposedRule(AcmeDeclarations::verify(), '', []);
        $this->assertThrows(
            fn () => $this->propose('agent-1', $request, 'request-1', $other),
            RuleProposalRefused::class,
        );
    }

    public function test_the_author_revises_to_revision_two_and_another_agent_cannot(): void
    {
        $request = $this->openRequest('agent-1', RequestHoldReason::UnknownCommand);
        $receipt = $this->propose('agent-1', $request, 'request-1', AcmeDeclarations::proposedVerify());

        $this->assertThrows(
            fn () => $this->revise('agent-2', $receipt->proposalId, 1),
            RuleProposalRefused::class,
        );
        $this->assertThrows(
            fn () => $this->revise('agent-1', $receipt->proposalId, 0),
            RuleProposalRefused::class,
        );

        $revised = $this->revise('agent-1', $receipt->proposalId, 1);

        $this->assertSame(2, $revised->revision);
        $this->assertSame(2, RuleProposal::query()->findOrFail($receipt->proposalId)->revisions()->count());
        $this->assertSame(RequestState::AwaitingSampleApproval, CommandRequest::query()->findOrFail($request)->state);
    }

    public function test_only_the_author_withdraws_and_a_withdrawn_proposal_takes_no_revision(): void
    {
        $request = $this->openRequest('agent-1', RequestHoldReason::UnknownCommand);
        $receipt = $this->propose('agent-1', $request, 'request-1', AcmeDeclarations::proposedVerify());

        $this->assertThrows(
            fn () => $this->runAsAgentId('agent-2', new WithdrawRuleProposalCommand($receipt->proposalId)),
            RuleProposalRefused::class,
        );
        $this->runAsAgentId('agent-1', new WithdrawRuleProposalCommand($receipt->proposalId));

        $this->assertSame(ProposalState::Withdrawn, RuleProposal::query()->findOrFail($receipt->proposalId)->state);
        $this->assertThrows(
            fn () => $this->revise('agent-1', $receipt->proposalId, 1),
            RuleProposalRefused::class,
        );
    }

    public function test_importing_a_declaration_file_creates_only_proposals(): void
    {
        $file = json_encode(['declarations' => [[
            'request_id' => 'import-1',
            'evidence' => 'acme --help documents verify',
            'examples' => [RuleExample::positive('acme verify', CommandClassSet::of(CommandClass::Read))->toArray()],
            'rule' => AcmeDeclarations::verify()->toArray(),
        ]]], JSON_THROW_ON_ERROR);

        $receipts = $this->runAsAgentId('agent-1', new ImportRuleProposalsCommand($file))->receipts;

        $this->assertCount(1, $receipts);
        $this->assertSame(ProposalState::Pending, $receipts[0]->state);
        $proposal = RuleProposal::query()->findOrFail($receipts[0]->proposalId);
        $this->assertEquals(AcmeDeclarations::verify(), $proposal->revisions()->firstOrFail()->payload);
        $this->assertSame(0, ClassificationRule::query()->count());
        $this->assertSame(0, RuleRevision::query()->count());
    }

    public function test_an_invalid_declaration_file_is_refused_naming_its_fields(): void
    {
        $rule = AcmeDeclarations::verify()->toArray();
        $rule['purpose'] = 'harmless';
        $rule['contracts'][0]['exits'][0]['status'] = 300;
        $declaration = ['request_id' => 'import-1', 'evidence' => '', 'examples' => [], 'rule' => $rule];
        $file = json_encode(['declarations' => [$declaration]]);

        try {
            $this->runAsAgentId('agent-1', new ImportRuleProposalsCommand((string) $file));
            $this->fail('The broken file was imported.');
        } catch (DeclarationInvalid $refusal) {
            $this->assertCount(2, $refusal->fields);
            $this->assertStringContainsString('declarations.0.rule.purpose', implode(' ', $refusal->fields));
        }

        $this->assertSame(0, RuleProposal::query()->count());
    }

    private function ordinary(): CommandRule
    {
        return CommandRule::forProgram(
            'project.acme.verify',
            new ProgramSpellings('acme'),
            ['verify'],
            ArgumentGrammar::none(),
            CommandClassSet::of(CommandClass::Read),
        )->ownedBy(RuleScope::project(), 1);
    }

    private function revise(string $agentId, string $proposalId, int $expectedRevision): ProposalReceipt
    {
        $command = new ReviseRuleProposalCommand($proposalId, $expectedRevision, AcmeDeclarations::proposedVerify());

        return $this->runAsAgentId($agentId, $command);
    }

    private function openRequest(string $agentId, RequestHoldReason $reason): string
    {
        $command = new OpenCommandRequestCommand('acme verify', str_repeat('a', 64), 'acme verify', self::FOLDER, $reason);

        return $this->runAsAgentId($agentId, $command);
    }

    private function propose(
        string $agentId,
        string $request,
        string $requestId,
        ProposedRule $proposed,
    ): ProposalReceipt {
        return $this->runAsAgentId($agentId, new ProposeCommandRuleCommand($request, $requestId, $proposed));
    }
}
