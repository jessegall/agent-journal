<?php

declare(strict_types=1);

namespace Tests\Commands\CommandRules;

use App\CommandRules\Commands\OpenCommandRequest\OpenCommandRequestCommand;
use App\CommandRules\Commands\ProposeRuleDeclaration\ProposeRuleDeclarationCommand;
use App\CommandRules\Declarations\RuleDeclaration;
use App\CommandRules\Enums\RequestHoldReason;
use App\CommandRules\Enums\RequestStatus;
use App\CommandRules\Values\RuleExample;
use App\Models\CommandRules\CommandRequest;
use App\Models\CommandRules\RuleProposal;
use Tests\Fixtures\Agents\TestStart;
use Tests\Fixtures\Processes\AcmeDeclarations;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * An agent proposes a declaration file through its tool, which moves the request on; the request reads it back.
 */
#[TestsCommand(ProposeRuleDeclarationCommand::class)]
final class ProposeRuleDeclarationTest extends TestCase
{
    use RefreshHookDatabase;

    private TestStart $start;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->idleAgent('Test agent')->startSession('Test agent', 'Test agent');
        $this->start = $this->journal->testStartCalled('Test agent');
    }

    public function test_a_proposal_moves_its_request_on_to_wait_for_a_sample(): void
    {
        $requestId = $this->journal->actAs('Test agent')->run(new OpenCommandRequestCommand(
            'acme verify',
            str_repeat('a', 64),
            'acme verify',
            '/projects/acme',
            RequestHoldReason::UnknownCommand,
        ));

        $receipt = $this->journal->runAsStart($this->start, new ProposeRuleDeclarationCommand(
            $requestId,
            json_encode(
                ['declarations' => [[...$this->declaration()->toArray(), 'request_id' => 'propose-1']]],
                JSON_THROW_ON_ERROR,
            ),
        ));

        $request = CommandRequest::query()->findOrFail($requestId);
        $this->assertSame(RequestStatus::AwaitingSampleApproval, $request->status);
        $this->assertSame(
            $receipt->proposalId,
            RuleProposal::query()->where('command_request_id', $requestId)->sole()->id,
        );
    }

    private function declaration(): RuleDeclaration
    {
        $proposed = AcmeDeclarations::proposedVerify();

        return RuleDeclaration::from([
            'request_id' => 'propose-1',
            'evidence' => $proposed->evidence,
            'examples' => array_map(fn (RuleExample $example) => $example->toArray(), $proposed->examples),
            'rule' => $proposed->rule->toArray(),
        ]);
    }
}
