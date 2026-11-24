<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Drivers\DriverCatalogue;
use App\Enums\DriverVariant;
use App\Events\StartSettingsRequested;
use App\Models\Drivers\HookCall;
use App\Support\ActorContext;
use App\Support\DefaultDrivers;
use App\Support\Drivers\Contracts\DriverAdapters;
use App\Support\IsolatedHookSettings;
use App\Support\StackTransaction;
use App\Support\StartStacks;
use App\Values\StackTarget;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Testing\TestResponse;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestStartAuthority;
use Tests\TestCase;

/**
 * A driver's own subagents never run. Every driver's start settings deny its native child tools, and the
 * hook endpoint refuses a call to one of them, or a call from inside a native child, before it touches a session.
 */
final class NativeSubagentRuleTest extends TestCase
{
    use CommitsHookRows;

    private const string RULE_REFERENCE = 'rule 36';

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'start_tokens',
        'agent_stacks',
        'hook_calls',
        'process_events',
        'part_runs',
        'process_runs',
        'command_requests',
    ];

    private TestStart $start;

    protected function setUp(): void
    {
        parent::setUp();

        $this->start = TestStart::start('main-agent');
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent($this->start->agent->id),
            TestStartAuthority::forAgent($this->start->agent->id),
        );
        $this->app->make(StackTransaction::class)->run(
            fn () => $this->app->make(StartStacks::class)->open($this->target()),
        );
    }

    public function test_both_drivers_of_a_family_answer_hooks_through_one_adapter(): void
    {
        $drivers = $this->app->make(DriverCatalogue::class);
        $adapters = $this->app->make(DriverAdapters::class);

        foreach (DefaultDrivers::familyKeys() as $family) {
            $terminal = $drivers->forKey($drivers->keyFor($family, DriverVariant::Terminal))->descriptor();
            $headless = $drivers->forKey($drivers->keyFor($family, DriverVariant::Headless))->descriptor();

            $this->assertSame(
                $adapters->for($terminal->hookProtocol),
                $adapters->for($headless->hookProtocol),
                $family,
            );
        }
    }

    public function test_rule_36_every_program_start_denies_each_native_child_tool(): void
    {
        foreach (DefaultDrivers::familyKeys() as $driver) {
            $settings = new IsolatedHookSettings();
            $this->app->make(Dispatcher::class)->dispatch(new StartSettingsRequested($driver, $settings));
            $denied = json_decode($settings->content(), true, flags: JSON_THROW_ON_ERROR)['permissions']['deny'];

            $childTools = $this->app->make(DriverAdapters::class)->for($driver)->nativeChildTools();
            $this->assertNotSame([], $childTools, $driver);

            foreach ($childTools as $toolName) {
                $this->assertContains($toolName, $denied, "{$driver}/{$toolName}");
            }
        }
    }

    public function test_rule_36_a_call_to_a_native_child_tool_is_refused_before_the_stack(): void
    {
        $body = (string) json_encode(
            [
                'session_id' => 'session-redacted',
                'hook_event_name' => 'PreToolUse',
                'tool_name' => 'collaboration.spawn_agent',
                'tool_input' => [],
            ],
        );

        $this->assertDenied($this->hook('codex', $body));
    }

    public function test_rule_36_a_call_from_inside_a_native_child_is_refused_before_the_stack(): void
    {
        $body = (string) json_encode(
            [
                'session_id' => 'session-redacted',
                'hook_event_name' => 'PreToolUse',
                'tool_name' => 'Bash',
                'tool_input' => ['command' => 'ls'],
                'agent_id' => 'child-1',
                'agent_type' => 'general-purpose',
            ],
        );

        $this->assertDenied($this->hook('claude-code', $body));
    }

    private function assertDenied(TestResponse $response): void
    {
        $response->assertOk();
        $this->assertStringContainsString(self::RULE_REFERENCE, $response->json('stdout'));
        $this->assertSame(0, HookCall::query()->authorizedFor($this->target())->count());
    }

    private function hook(string $driver, string $body): TestResponse
    {
        $this->app->forgetScopedInstances();

        return $this->call(
            'POST',
            "/hooks/{$driver}",
            server: $this->start->serverHeaders($body, 'call-1', target: "/hooks/{$driver}"),
            content: $body,
        );
    }

    private function target(): StackTarget
    {
        return new StackTarget($this->start->agent->id, $this->start->session->id);
    }
}
