<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Agents\Events\LaunchSettingsRequested;
use App\Agents\Support\IsolatedHookSettings;
use App\Agents\Support\StackTarget;
use App\Hooks\Actions\LaunchStacks;
use App\Hooks\Enums\ReadyStateType;
use App\Hooks\Models\HookCall;
use App\Hooks\Support\StackTransaction;
use App\Programs\Enums\HookProgram;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Testing\TestResponse;
use Tests\Fixtures\Agents\TestLaunch;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * Rule 36: a program's own subagents never run. Every program's launch settings deny its native child tools, and the
 * hook endpoint refuses a call to one of them, or a call from inside a native child, before it touches a session.
 */
final class NativeSubagentRuleTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['agents', 'agent_sessions', 'launch_credentials', 'agent_stacks', 'hook_calls'];

    private TestLaunch $launch;

    protected function setUp(): void
    {
        parent::setUp();

        $this->launch = TestLaunch::start('hooks.main_ready');
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forAgent($this->launch->agent->id));
        $this->app->make(StackTransaction::class)->run(fn () => $this->app->make(LaunchStacks::class)->open($this->target(), ReadyStateType::MainAgent));
    }

    public function test_rule_36_every_program_launch_denies_each_native_child_tool(): void
    {
        foreach (HookProgram::cases() as $program) {
            $settings = new IsolatedHookSettings();
            $this->app->make(Dispatcher::class)->dispatch(new LaunchSettingsRequested($program->value, $settings));
            $denied = json_decode($settings->content(), true, flags: JSON_THROW_ON_ERROR)['permissions']['deny'];

            $this->assertNotSame([], $program->nativeChildTools(), $program->value);
            foreach ($program->nativeChildTools() as $toolName) {
                $this->assertContains($toolName, $denied, "{$program->value} launches without denying {$toolName}");
            }
        }
    }

    public function test_rule_36_a_call_to_a_native_child_tool_is_refused_before_the_stack(): void
    {
        $body = (string) json_encode(['session_id' => 'session-redacted', 'hook_event_name' => 'PreToolUse', 'tool_name' => 'collaboration.spawn_agent', 'tool_input' => []]);

        $this->assertDenied($this->hook('codex', $body));
    }

    public function test_rule_36_a_call_from_inside_a_native_child_is_refused_before_the_stack(): void
    {
        $body = (string) json_encode(['session_id' => 'session-redacted', 'hook_event_name' => 'PreToolUse', 'tool_name' => 'Bash', 'tool_input' => ['command' => 'ls'], 'agent_id' => 'child-1', 'agent_type' => 'general-purpose']);

        $this->assertDenied($this->hook('claude-code', $body));
    }

    private function assertDenied(TestResponse $response): void
    {
        $response->assertOk();
        $this->assertStringContainsString('rule 36', $response->json('stdout'));
        $this->assertSame(0, HookCall::query()->authorizedFor($this->target())->count());
    }

    private function hook(string $program, string $body): TestResponse
    {
        $this->app->forgetScopedInstances();

        return $this->call('POST', "/hooks/{$program}", server: $this->launch->serverHeaders($body, 'call-1', target: "/hooks/{$program}"), content: $body);
    }

    private function target(): StackTarget
    {
        return new StackTarget($this->launch->agent->id, $this->launch->session->id);
    }
}
