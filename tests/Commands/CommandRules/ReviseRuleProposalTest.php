<?php

declare(strict_types=1);

namespace Tests\Commands\CommandRules;

use App\CommandRules\Commands\OpenCommandRequest\OpenCommandRequestCommand;
use App\CommandRules\Commands\ProposeCommandRule\ProposeCommandRuleCommand;
use App\CommandRules\Commands\ReviseRuleProposal\ReviseRuleProposalCommand;
use App\CommandRules\Enums\RequestHoldReason;
use App\CommandRules\Enums\RequestStatus;
use App\CommandRules\Exceptions\RuleProposalRefused;
use App\CommandRules\Values\ProposalReceipt;
use App\CommandRules\Values\ProposedRule;
use App\Models\CommandRules\CommandRequest;
use App\Models\CommandRules\RuleProposal;
use Tests\Fixtures\Processes\AcmeDeclarations;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The author revises a proposal to its second revision; another agent cannot.
 */
#[TestsCommand(ReviseRuleProposalCommand::class)]
final class ReviseRuleProposalTest extends TestCase
{
    use RefreshHookDatabase;

    private const string FOLDER = '/projects/acme';

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->placeBareAgentsInLocalProject();
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
        $this->assertSame(RequestStatus::AwaitingSampleApproval, CommandRequest::query()->findOrFail($request)->status);
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
