<?php

declare(strict_types=1);

namespace Tests\Commands\CommandRules;

use App\Declarations\RuleDeclaration;
use App\Enums\CommandRules\RequestStatus;
use App\Mcp\Tools\CommandRequestShowTool;
use App\Mcp\Tools\CommandTypeProposeTool;
use App\Values\RuleExample;
use Tests\Fixtures\Agents\TestStart;
use Tests\Fixtures\Processes\AcmeDeclarations;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * An agent proposes a declaration file through its tool, which moves the request on; the request reads it back.
 */
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

    public function test_a_proposal_through_the_tool_moves_the_request_on_and_the_show_tool_reads_it_back(): void
    {
        $requestId = $this->explainAcme();

        $proposal = $this->journal->mcpTool($this->start, CommandTypeProposeTool::NAME, [
            'request' => $requestId,
            'declaration_file' => json_encode(
                ['declarations' => [[...$this->declaration()->toArray(), 'request_id' => 'propose-tool-1']]],
                JSON_THROW_ON_ERROR,
            ),
            'request_key' => 'propose-tool-1',
        ])->assertOk()->assertJsonPath('result.isError', false)->json('result.structuredContent');

        $this->app->forgetScopedInstances();
        $shown = $this->journal->mcpTool(
            $this->start,
            CommandRequestShowTool::NAME,
            ['request' => $requestId],
        )->assertOk()
            ->assertJsonPath('result.isError', false)
            ->json('result.structuredContent');
        $this->assertSame(RequestStatus::AwaitingSampleApproval->value, $shown['state']);
        $this->assertSame($proposal['proposal_id'], $shown['proposals'][0]['proposal_id']);
    }

    private function explainAcme(): string
    {
        return (string) $this->journal->agentCall(
            $this->start,
            'POST',
            '/agent/processes/explain',
            ['line' => 'acme verify'],
        )
            ->json('held.0.requestId');
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
