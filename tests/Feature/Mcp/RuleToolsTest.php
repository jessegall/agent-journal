<?php

declare(strict_types=1);

namespace Tests\Feature\Mcp;

use Domain\Rules\RulesDomain;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\HoldingRules;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

#[TimeLimit(5, 'Signed MCP calls cover rule proposals, recovery reads, and catalogue discovery.')]
final class RuleToolsTest extends TestCase
{
    use CommitsHookRows;

    private const string RULE_REASON = 'A retry should return the first receipt.';

    private const string RULE_TEXT = 'Use the same request key on retry.';

    private const array TABLES = [
        'agents', 'agent_sessions', 'session_tokens', 'agent_stacks', 'rules', 'command_receipts',
    ];

    /**
     * The domains whose tools this test calls.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(RulesDomain::class);
    }

    public function test_an_agent_proposes_a_rule_and_reads_both_rule_states(): void
    {
        $caller = TestStart::start();
        $active = HoldingRules::create('Use a named request key.');

        $proposal = $this->journal->mcpTool($caller, 'rules_propose', [
            'text' => 'Use the same request key on retry.',
            'reason' => 'A retry should return the first receipt.',
            'replaces_rule_id' => $active->id,
            'request_key' => 'rule-proposal',
        ])->assertOk()->assertJsonPath('result.isError', false)->json('result.structuredContent.rule_id');

        $activePage = $this->journal->mcpTool($caller, 'rules_list', ['state' => 'active', 'page' => 1])->assertOk()
            ->assertJsonPath('result.structuredContent.cards.0.rule_id', $active->id)
            ->json('result.structuredContent');
        $resource = $this->journal->mcpRequest($caller, 'resources/read', ['uri' => 'journal://v1/rules'])
            ->assertOk()->json('result.contents.0.text');
        $this->assertSame($activePage, json_decode($resource, true, flags: JSON_THROW_ON_ERROR));

        $this->journal->mcpTool($caller, 'rules_list', ['state' => 'proposed'])->assertOk()
            ->assertJsonPath('result.structuredContent.cards.0.rule_id', $proposal)
            ->assertJsonPath('result.structuredContent.cards.0.state', 'proposed');
        $this->journal->mcpTool($caller, 'rules_read', ['rule_id' => $proposal])->assertOk()
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
            $page = $this->journal->mcpRequest($caller, 'tools/list', $arguments)->assertOk()->json('result');
            $names = [...$names, ...array_column($page['tools'], 'name')];
            $arguments = isset($page['nextCursor']) ? ['cursor' => $page['nextCursor']] : [];
        } while ($arguments !== []);

        $ruleTools = array_values(array_filter($names, fn (string $name): bool => str_starts_with($name, 'rules_')));
        $this->assertEqualsCanonicalizing(['rules_list', 'rules_read', 'rules_propose'], $ruleTools);
        $this->journal->mcpRequest($caller, 'tools/call', [
            'name' => 'rules_approve',
            'arguments' => ['rule_id' => HoldingRules::create('A rule.')->id],
        ])->assertBadRequest()->assertJsonPath('error.code', -32602);
    }
}
