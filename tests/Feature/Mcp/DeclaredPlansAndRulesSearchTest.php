<?php

declare(strict_types=1);

namespace Tests\Feature\Mcp;

use App\Support\ActorContext;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Plans\Models\Plan;
use Domain\Rules\Models\Rule;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\SendsMcpFrames;
use Tests\Support\SendsSignedCalls;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Search within plans.plan and within rules.rule finds their records for the words, and a plan reference resolves
 * in one search plus one open.
 */
#[TimeLimit(5, 'Each case sends several signed MCP calls.')]
final class DeclaredPlansAndRulesSearchTest extends TestCase
{
    use CommitsHookRows;
    use SendsMcpFrames;
    use SendsSignedCalls;

    private const array TABLES = [
        'users', 'plans', 'rules', 'agents', 'agent_sessions', 'start_tokens', 'agent_stacks', 'hook_calls',
        'command_receipts',
    ];

    private TestStart $caller;

    protected function setUp(): void
    {
        parent::setUp();

        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->caller = TestStart::start();
    }

    public function test_within_plans_and_within_rules_find_their_records(): void
    {
        $plan = Plan::factory()->create(['title' => 'Driver rollout']);
        $proposer = ActorContext::forAgent(TestIds::of(70));
        $rule = Rule::create('Keep every driver small.', 'Drivers grew.', null, $proposer);

        $declaredPlans = $this->idsOf('result.structuredContent.hits', ['query' => 'driver', 'within' => 'plans.plan']);
        $declaredRules = $this->idsOf('result.structuredContent.hits', ['query' => 'driver', 'within' => 'rules.rule']);

        $this->assertSame([$plan->id], $declaredPlans);
        $this->assertSame([$rule->id], $declaredRules);
    }

    public function test_a_plan_reference_resolves_in_one_search_and_one_open(): void
    {
        $plan = Plan::factory()->create(['title' => 'One search across domain declarations']);

        $search = $this->callMcpTool($this->caller, 'search', ['query' => "plan {$plan->number}"])
            ->assertJsonPath('result.structuredContent.direct_open.reference.id', $plan->id)
            ->assertJsonPath('result.structuredContent.direct_open.open.tool', 'plans_read');
        $open = $search->json('result.structuredContent.direct_open.open');

        $this->callMcpTool($this->caller, $open['tool'], $open['arguments'])
            ->assertJsonPath('result.isError', false)
            ->assertJsonPath('result.structuredContent.plan_id', $plan->id);
    }

    /**
     * @param  array<string, mixed>  $arguments
     * @return list<string>
     */
    private function idsOf(string $path, array $arguments): array
    {
        $hits = $this->callMcpTool($this->caller, 'search', $arguments)->json($path);

        return array_map(fn (array $hit): string => $hit['reference']['id'], $hits);
    }
}
