<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use Illuminate\Support\Str;
use Tests\Support\ActsAsOwner;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A person launches a main agent with a program and a model named outright (doc 14 revision 4, 'A launch always
 * names a model'): a named pair launches, a missing one or the default model without a profile is refused before any
 * session exists.
 */
final class MainLaunchTest extends TestCase
{
    use ActsAsOwner;
    use RefreshHookDatabase;

    public function test_a_named_program_and_model_launch_the_agent(): void
    {
        $agent = Agent::named('Launched by hand', 'read-only-helper');

        $response = $this->actingAs($this->owner)->postJson(route('agents.launch', $agent->id), [
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
        $agent = Agent::named('Launched by hand', 'read-only-helper');
        $inputs = [['model' => 'gpt-6-luna'], ['program' => 'codex'], ['program' => 'codex', 'model' => 'default']];

        foreach ($inputs as $input) {
            $response = $this->actingAs($this->owner)->postJson(
                route('agents.launch', $agent->id),
                ['requestId' => (string) Str::ulid(), ...$input],
            );

            $this->assertGreaterThanOrEqual(400, $response->status(), json_encode($input, JSON_THROW_ON_ERROR));
        }

        $this->assertSame(0, AgentSession::query()->where('agent_id', $agent->id)->count());
    }
}
