<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use Illuminate\Support\Str;
use Tests\Support\Agents\ServesEveryCombination;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A user starts a main agent with a driver and a model named outright: a named pair starts, a missing one or the default model without a profile is refused before any
 * session exists.
 */
final class MainStartTest extends TestCase
{
    use RefreshHookDatabase;
    use ServesEveryCombination;
    use WithActiveAccount;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();

        $this->chooseActiveAccounts();
        $this->serveEveryCombination();
    }

    public function test_a_named_program_and_model_start_the_agent(): void
    {
        $agent = Agent::create('Started by hand', 'read-only-helper', $this->localProject());

        $response = $this->actingAs($this->journal->ownerUser())->postJson(route('agents.start', $agent->id), [
            'requestId' => (string) Str::ulid(),
            'driver' => 'codex',
            'model' => 'gpt-6-luna',
        ]);

        $response->assertOk();
        $response->assertJsonPath('driver', 'codex');
        $response->assertJsonPath('requestedModel', 'gpt-6-luna');
        $this->assertSame(1, AgentSession::query()->where('agent_id', $agent->id)->count());
    }

    public function test_a_missing_program_or_model_or_the_default_model_is_refused_without_a_session(): void
    {
        $agent = Agent::create('Started by hand', 'read-only-helper', $this->localProject());
        $inputs = [['model' => 'gpt-6-luna'], ['driver' => 'codex'], ['driver' => 'codex', 'model' => 'default']];

        foreach ($inputs as $input) {
            $response = $this->actingAs($this->journal->ownerUser())->postJson(
                route('agents.start', $agent->id),
                ['requestId' => (string) Str::ulid(), ...$input],
            );

            $this->assertGreaterThanOrEqual(400, $response->status(), json_encode($input, JSON_THROW_ON_ERROR));
        }

        $this->assertSame(0, AgentSession::query()->where('agent_id', $agent->id)->count());
    }
}
