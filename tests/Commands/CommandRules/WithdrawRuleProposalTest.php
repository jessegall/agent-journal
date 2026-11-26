<?php

declare(strict_types=1);

namespace Tests\Commands\CommandRules;

use App\CommandRules\Commands\OpenCommandRequest\OpenCommandRequestCommand;
use App\CommandRules\Commands\ProposeCommandRule\ProposeCommandRuleCommand;
use App\CommandRules\Commands\ReviseRuleProposal\ReviseRuleProposalCommand;
use App\CommandRules\Commands\WithdrawRuleProposal\WithdrawRuleProposalCommand;
use App\CommandRules\Enums\ProposalStatus;
use App\CommandRules\Enums\RequestHoldReason;
use App\CommandRules\Exceptions\RuleProposalRefused;
use App\CommandRules\Values\ProposalReceipt;
use App\CommandRules\Values\ProposedRule;
use App\Models\CommandRules\RuleProposal;
use Tests\Fixtures\Processes\AcmeDeclarations;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Only the author withdraws a proposal, and a withdrawn proposal takes no new revision.
 */
#[TestsCommand(WithdrawRuleProposalCommand::class)]
final class WithdrawRuleProposalTest extends TestCase
{
    use RefreshHookDatabase;

    private const string FOLDER = '/projects/acme';

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->placeBareAgentsInLocalProject();
    }

    public function test_only_the_author_withdraws_and_a_withdrawn_proposal_takes_no_revision(): void
    {
        $request = $this->openRequest('agent-1', RequestHoldReason::UnknownCommand);
        $receipt = $this->propose('agent-1', $request, 'request-1', AcmeDeclarations::proposedVerify());

        $this->assertThrows(
            fn () => $this->journal->runAsAgentId('agent-2', new WithdrawRuleProposalCommand($receipt->proposalId)),
            RuleProposalRefused::class,
        );
        $this->journal->runAsAgentId('agent-1', new WithdrawRuleProposalCommand($receipt->proposalId));

        $this->assertSame(ProposalStatus::Withdrawn, RuleProposal::query()->findOrFail($receipt->proposalId)->status);
        $this->assertThrows(
            fn () => $this->revise('agent-1', $receipt->proposalId, 1),
            RuleProposalRefused::class,
        );
    }

    private function revise(string $agentId, string $proposalId, int $expectedRevision): ProposalReceipt
    {
        $command = new ReviseRuleProposalCommand($proposalId, $expectedRevision, AcmeDeclarations::proposedVerify());

        return $this->journal->runAsAgentId($agentId, $command);
    }

    private function openRequest(string $agentId, RequestHoldReason $reason): string
    {
        $command = new OpenCommandRequestCommand('acme verify', str_repeat('a', 64), 'acme verify', self::FOLDER, $reason);

        return $this->journal->runAsAgentId($agentId, $command);
    }

    private function propose(
        string $agentId,
        string $request,
        string $requestId,
        ProposedRule $proposed,
    ): ProposalReceipt {
        return $this->journal->runAsAgentId($agentId, new ProposeCommandRuleCommand($request, $requestId, $proposed));
    }
}
