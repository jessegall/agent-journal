<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use Illuminate\Support\Str;
use Tests\Support\ActsAsOwner;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A user starts a main agent with a program and a model named outright (doc 14 revision 4, 'A start always
 * names a model'): a named pair starts, a missing one or the default model without a profile is refused before any
 * session exists.
 */
final class MainStartTest extends TestCase
{
    use ActsAsOwner;
    use RefreshHookDatabase;
    use WithActiveAccount;

    protected function setUp(): void
    {
        parent::setUp();

        $this->chooseActiveAccounts();
    }

    public function test_a_named_program_and_model_start_the_agent(): void
    {
        $agent = Agent::named('Started by hand', 'read-only-helper');

        $response = $this->actingAs($this->owner)->postJson(route('agents.start', $agent->id), [
            'requestId' => (string) Str::ulid(),
            'program' => 'codex',
            'model' => 'gpt-6-luna',
        ]);

        $response->assertOk();
        $response->assertJsonPath('program', 'codex');
        $response->assertJsonPath('requestedModel', 'gpt-6-luna');
        $this->assertSame(1, AgentSession::query()->where('agent_id', $agent->id)->count());
    }

    public function test_a_missing_program_or_model_or_the_default_model_is_refused_without_a_session(): void
    {
        $agent = Agent::named('Started by hand', 'read-only-helper');
        $inputs = [['model' => 'gpt-6-luna'], ['program' => 'codex'], ['program' => 'codex', 'model' => 'default']];

        foreach ($inputs as $input) {
            $response = $this->actingAs($this->owner)->postJson(
                route('agents.start', $agent->id),
                ['requestId' => (string) Str::ulid(), ...$input],
            );

            $this->assertGreaterThanOrEqual(400, $response->status(), json_encode($input, JSON_THROW_ON_ERROR));
        }

        $this->assertSame(0, AgentSession::query()->where('agent_id', $agent->id)->count());
    }
}
