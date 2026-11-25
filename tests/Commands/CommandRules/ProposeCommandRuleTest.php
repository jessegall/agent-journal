<?php

declare(strict_types=1);

namespace Tests\Commands\CommandRules;

use App\Commands\CommandRules\OpenCommandRequest\OpenCommandRequestCommand;
use App\Commands\CommandRules\ProposeCommandRule\ProposeCommandRuleCommand;
use App\Enums\CommandRules\CommandClass;
use App\Enums\CommandRules\CommandType;
use App\Enums\CommandRules\ProposalStatus;
use App\Enums\CommandRules\RequestHoldReason;
use App\Enums\CommandRules\RequestStatus;
use App\Enums\CommandRules\ToolType;
use App\Exceptions\RuleProposalRefused;
use App\Models\CommandRules\ClassificationRule;
use App\Models\CommandRules\CommandRequest;
use App\Models\CommandRules\RuleProposal;
use App\Models\CommandRules\RuleRevision;
use App\Support\CommandRuleRegistry;
use App\Values\ArgumentGrammar;
use App\Values\CommandClassSet;
use App\Values\CommandRule;
use App\Values\ProgramSpellings;
use App\Values\ProposalReceipt;
use App\Values\ProposedRule;
use App\Values\RuleScope;
use Tests\Fixtures\Processes\AcmeDeclarations;
use Tests\Support\ActsAsActors;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * An agent proposes a command rule: a complete proposal waits for review and moves the request on without activating;
 * one without its exit policy stays a draft naming the field, a check cannot be relabelled as ordinary, and the same
 * request id makes no duplicate while another payload under it is refused.
 */
final class ProposeCommandRuleTest extends TestCase
{
    use ActsAsActors;
    use RefreshHookDatabase;

    private const string FOLDER = '/projects/acme';

    public function test_a_complete_proposal_waits_for_review_and_moves_the_request_on_without_activating(): void
    {
        $request = $this->openRequest('agent-1', RequestHoldReason::UnknownCommand);

        $receipt = $this->propose('agent-1', $request, 'request-1', AcmeDeclarations::proposedVerify());

        $this->assertSame(ProposalStatus::Pending, $receipt->state);
        $this->assertSame([], $receipt->missingFields);
        $this->assertSame(RequestStatus::AwaitingSampleApproval, CommandRequest::query()->findOrFail($request)->status);
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

        $this->assertSame(ProposalStatus::Draft, $receipt->state);
        $this->assertSame(['contracts.0.exits'], $receipt->missingFields);
        $this->assertSame(RequestStatus::CollectingDeclaration, CommandRequest::query()->findOrFail($request)->status);
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
