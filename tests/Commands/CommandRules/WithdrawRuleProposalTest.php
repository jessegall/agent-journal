<?php

declare(strict_types=1);

namespace Tests\Commands\CommandRules;

use App\Commands\CommandRules\OpenCommandRequest\OpenCommandRequestCommand;
use App\Commands\CommandRules\ProposeCommandRule\ProposeCommandRuleCommand;
use App\Commands\CommandRules\ReviseRuleProposal\ReviseRuleProposalCommand;
use App\Commands\CommandRules\WithdrawRuleProposal\WithdrawRuleProposalCommand;
use App\Enums\CommandRules\ProposalStatus;
use App\Enums\CommandRules\RequestHoldReason;
use App\Exceptions\RuleProposalRefused;
use App\Models\CommandRules\RuleProposal;
use App\Values\ProposalReceipt;
use App\Values\ProposedRule;
use Tests\Fixtures\Processes\AcmeDeclarations;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Only the author withdraws a proposal, and a withdrawn proposal takes no new revision.
 */
final class WithdrawRuleProposalTest extends TestCase
{
    use RefreshHookDatabase;

    private const string FOLDER = '/projects/acme';

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
