<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Declarations\RuleDeclaration;
use App\Enums\RequestState;
use App\Mcp\Tools\CommandRequestShowTool;
use App\Mcp\Tools\CommandTypeProposeTool;
use App\Models\CommandRules\ClassificationRule;
use App\Models\CommandRules\CommandRequest;
use App\Models\CommandRules\RuleProposal;
use App\Values\AgentText;
use App\Values\RuleExample;
use Tests\Fixtures\Processes\AcmeDeclarations;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\SendsMcpFrames;
use Tests\Support\SendsSignedCalls;
use Tests\Support\StartsTestAgent;
use Tests\Support\TestText;
use Tests\TestCase;

/**
 * An agent explains an unknown line, gets the request that holds it and the next command, proposes through the
 * command-type routes and reads the request back; owner actions are refused for an agent.
 */
final class CommandTypeRoutesTest extends TestCase
{
    use RefreshHookDatabase;
    use SendsMcpFrames;
    use SendsSignedCalls;
    use StartsTestAgent;

    private const string PROPOSE_STEP = 'the command_types_propose tool with request ';

    private const string APPROVE_STEP = "waiting for the owner to approve request %s's sample";

    public function test_explaining_an_unknown_line_opens_its_request_and_names_the_propose_step(): void
    {
        $reply = $this->signed($this->start, '/agent/processes/explain', ['line' => 'acme verify'])->assertOk();

        $this->assertSame(TestText::words(AgentText::of('core.shell.nothing_started')), $reply->json('notice'));
        $this->assertSame('acme', $reply->json('held.0.operation'));
        $this->assertSame(RequestState::CollectingDeclaration->value, $reply->json('held.0.requestState'));
        $this->assertStringStartsWith(self::PROPOSE_STEP, (string) $reply->json('held.0.next'));
        $this->assertSame(1, CommandRequest::query()->count());
    }

    public function test_explaining_a_check_without_a_proven_reader_opens_a_reader_request(): void
    {
        $reply = $this->signed($this->start, '/agent/processes/explain', ['line' => 'vendor/bin/phpstan analyse'])
            ->assertOk();

        $this->assertContains('reader_required', array_column((array) $reply->json('held'), 'code'));
    }

    public function test_a_proposal_through_the_tool_moves_the_request_on_and_the_show_tool_reads_it_back(): void
    {
        $requestId = $this->explainAcme();

        $proposal = $this->callMcpTool($this->start, CommandTypeProposeTool::NAME, [
            'request' => $requestId,
            'declaration_file' => json_encode(
                ['declarations' => [[...$this->declaration()->toArray(), 'request_id' => 'propose-tool-1']]],
                JSON_THROW_ON_ERROR,
            ),
            'request_key' => 'propose-tool-1',
        ])->assertJsonPath('result.isError', false)->json('result.structuredContent');

        $this->app->forgetScopedInstances();
        $shown = $this->callMcpTool($this->start, CommandRequestShowTool::NAME, ['request' => $requestId])
            ->assertJsonPath('result.isError', false)
            ->json('result.structuredContent');
        $this->assertSame(RequestState::AwaitingSampleApproval->value, $shown['state']);
        $this->assertSame($proposal['proposal_id'], $shown['proposals'][0]['proposal_id']);
    }

    public function test_a_proposal_through_the_route_moves_the_request_on_and_show_reads_it_back(): void
    {
        $requestId = $this->explainAcme();

        $reply = $this->signed($this->start, "/agent/processes/requests/{$requestId}/proposals", [
            'declaration' => $this->declaration()->toArray(),
            'request_key' => 'propose-1',
        ])->assertOk();

        $this->assertSame('pending', $reply->json('state'));
        $this->app->forgetScopedInstances();
        $shown = $this->signed($this->start, "/agent/processes/requests/{$requestId}/show", [])->assertOk();
        $this->assertSame(RequestState::AwaitingSampleApproval->value, $shown->json('state'));
        $this->assertSame(sprintf(self::APPROVE_STEP, $requestId), $shown->json('next'));
        $this->assertSame($reply->json('proposal_id'), $shown->json('proposals.0.proposal_id'));
    }

    public function test_an_invalid_declaration_answers_its_field_errors(): void
    {
        $requestId = $this->explainAcme();
        $declaration = $this->declaration()->toArray();
        $declaration['rule']['purpose'] = 'harmless';

        $reply = $this->signed($this->start, "/agent/processes/requests/{$requestId}/proposals", [
            'declaration' => $declaration,
            'request_key' => 'propose-1',
        ])->assertStatus(422);

        $this->assertStringContainsString('declarations.0.rule.purpose', (string) $reply->json('message'));
        $this->assertSame(0, RuleProposal::query()->count());
    }

    public function test_an_agent_cannot_approve_through_the_route(): void
    {
        $requestId = $this->explainAcme();
        $proposal = $this->signed($this->start, "/agent/processes/requests/{$requestId}/proposals", [
            'declaration' => $this->declaration()->toArray(),
            'request_key' => 'propose-1',
        ])->json('proposal_id');

        $path = "/agent/processes/proposals/{$proposal}/approve";
        $reply = $this->signed($this->start, $path, ['expected_revision' => 1, 'request_key' => 'approve-1']);

        $this->assertFalse($reply->isSuccessful());
        $this->assertSame(0, ClassificationRule::query()->count());
    }

    private function explainAcme(): string
    {
        return (string) $this->signed($this->start, '/agent/processes/explain', ['line' => 'acme verify'])
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
