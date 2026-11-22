<?php

declare(strict_types=1);

namespace Tests\Feature\Mcp;

use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\HoldingRules;
use Tests\Support\SendsMcpFrames;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

#[TimeLimit(5, 'Signed MCP calls cover rule proposals, recovery reads, and catalogue discovery.')]
final class RuleToolsTest extends TestCase
{
    use CommitsHookRows;
    use SendsMcpFrames;

    private const string RULE_REASON = 'A retry should return the first receipt.';

    private const string RULE_TEXT = 'Use the same request key on retry.';

    private const array TABLES = [
        'agents', 'agent_sessions', 'start_tokens', 'agent_stacks', 'rules', 'command_receipts',
    ];

    public function test_an_agent_proposes_a_rule_and_reads_both_rule_states(): void
    {
        $caller = TestStart::start();
        $active = HoldingRules::create('Use a named request key.');

        $proposal = $this->callMcpTool($caller, 'rules_propose', [
            'text' => 'Use the same request key on retry.',
            'reason' => 'A retry should return the first receipt.',
            'replaces_rule_id' => $active->id,
            'request_key' => 'rule-proposal',
        ])->assertJsonPath('result.isError', false)->json('result.structuredContent.rule_id');

        $activePage = $this->callMcpTool($caller, 'rules_list', ['state' => 'active', 'page' => 1])
            ->assertJsonPath('result.structuredContent.cards.0.rule_id', $active->id)
            ->json('result.structuredContent');
        $resource = $this->sendMcp($caller, 'resources/read', ['uri' => 'journal://v1/rules'])
            ->assertOk()->json('result.contents.0.text');
        $this->assertSame($activePage, json_decode($resource, true, flags: JSON_THROW_ON_ERROR));

        $this->callMcpTool($caller, 'rules_list', ['state' => 'proposed'])
            ->assertJsonPath('result.structuredContent.cards.0.rule_id', $proposal)
            ->assertJsonPath('result.structuredContent.cards.0.state', 'proposed');
        $this->callMcpTool($caller, 'rules_read', ['rule_id' => $proposal])
            ->assertJsonPath('result.structuredContent.text', self::RULE_TEXT)
            ->assertJsonPath('result.structuredContent.reason', self::RULE_REASON)
            ->assertJsonPath('result.structuredContent.replaces_rule_number', $active->number);
    }

    public function test_an_agent_cannot_discover_or_forge_rule_approval(): void
    {
        $caller = TestStart::start();
        $arguments = [];
        $names = [];

        do {
            $page = $this->sendMcp($caller, 'tools/list', $arguments)->assertOk()->json('result');
            $names = [...$names, ...array_column($page['tools'], 'name')];
            $arguments = isset($page['nextCursor']) ? ['cursor' => $page['nextCursor']] : [];
        } while ($arguments !== []);

        $ruleTools = array_values(array_filter($names, fn (string $name): bool => str_starts_with($name, 'rules_')));
        $this->assertEqualsCanonicalizing(['rules_list', 'rules_read', 'rules_propose'], $ruleTools);
        $this->sendMcp($caller, 'tools/call', [
            'name' => 'rules_approve',
            'arguments' => ['rule_id' => HoldingRules::create('A rule.')->id],
        ])->assertBadRequest()->assertJsonPath('error.code', -32602);
    }
}
