<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Contracts\LaunchTransaction;
use App\Domains\Support\DomainEntry;
use App\Domains\Support\DomainRegistry;
use App\Hooks\Contracts\ProgramCall;
use App\Hooks\Inputs\HookIdentity;
use App\Hooks\Programs\HookPayload;
use App\Hooks\Programs\ProgramAdapters;
use App\Hooks\Stack\StateTypes;
use App\Hooks\States\AgentState;
use App\Hooks\Support\HookRetryWindow;
use App\Hooks\Support\RetentionPeriods;
use App\Hooks\Support\StackTransaction;
use App\Processes\Contracts\ShellCommandParser;
use App\Processes\Support\ShellParser;
use App\Programs\Enums\HookProgram;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\DataProvider;
use ReflectionClass;
use ReflectionMethod;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestIds;
use Tests\TestCase;

final class HookRuntimeReadinessTest extends TestCase
{
    use RefreshHookDatabase;

    private const array SHELL_CALL = ['tool_input' => ['command' => 'git status'], 'tool_response' => []];

    private const array EVENT_FIELDS = [
        'claude-code' => [
            'SessionStart' => ['source' => 'startup'],
            'UserPromptSubmit' => ['prompt' => 'Build the walk.'],
            'PreToolUse' => ['tool_name' => 'Bash', ...self::SHELL_CALL],
            'PostToolUse' => ['tool_name' => 'Bash', ...self::SHELL_CALL],
            'Stop' => ['stop_hook_active' => false],
            'SessionEnd' => ['reason' => 'other'],
        ],
        'codex' => [
            'SessionStart' => ['source' => 'startup'],
            'UserPromptSubmit' => ['prompt' => 'Build the walk.'],
            'PreToolUse' => ['tool_name' => 'Bash', ...self::SHELL_CALL],
            'PostToolUse' => ['tool_name' => 'Bash', ...self::SHELL_CALL],
            'Stop' => ['stop_hook_active' => false],
            'SessionEnd' => ['reason' => 'other'],
        ],
    ];

    /**
     * @return iterable<string, array{HookProgram, string}>
     */
    public static function programEvents(): iterable
    {
        foreach (HookProgram::cases() as $program) {
            foreach ($program->nativeEvents() as $event) {
                yield "{$program->value} {$event}" => [$program, $event];
            }
        }
    }

    /**
     * @return iterable<string, array{HookProgram}>
     */
    public static function programs(): iterable
    {
        foreach (HookProgram::cases() as $program) {
            yield $program->value => [$program];
        }
    }

    #[DataProvider('programs')]
    public function test_each_program_has_its_endpoint_and_an_adapter_mapping_only_real_hooks(HookProgram $program): void
    {
        $capabilities = $this->app->make(ProgramAdapters::class)->for($program)->capabilities();

        $this->assertTrue(Route::has('hooks.answer'));
        $this->assertSame("/hooks/{$program->value}", route('hooks.answer', ['program' => $program->value], false));
        $this->assertSame([], array_values(array_diff($capabilities->hookMethods, $this->hookMethods())));
    }

    #[DataProvider('programEvents')]
    public function test_every_event_the_isolated_settings_register_is_mapped_by_the_adapter(HookProgram $program, string $event): void
    {
        $payload = HookPayload::from(['session_id' => 'session-1', 'hook_event_name' => $event, ...self::EVENT_FIELDS[$program->value][$event]]);

        $call = $this->app->make(ProgramAdapters::class)->for($program)->callFor($payload, new HookIdentity(TestIds::of(1), TestIds::of(10), 'call-1', hash('sha256', $event)));

        $this->assertInstanceOf(ProgramCall::class, $call);
    }

    public function test_the_runtime_binds_the_real_parser_launch_transaction_and_state_types(): void
    {
        $registry = $this->app->make(StateTypes::class)->registry();

        $this->assertInstanceOf(ShellParser::class, $this->app->make(ShellCommandParser::class));
        $this->assertInstanceOf(StackTransaction::class, $this->app->make(LaunchTransaction::class));

        foreach (['hooks.main_ready', 'hooks.read_only_helper_ready', 'tasks.working', 'communication.answering', 'sequences.following'] as $typeKey) {
            $this->assertTrue($registry->has($typeKey), $typeKey);
        }
    }

    public function test_the_configured_limits_hold_together(): void
    {
        $retryWindow = $this->app->make(HookRetryWindow::class);

        $this->app->make(RetentionPeriods::class)->checkLongerThan($retryWindow);
        $this->assertGreaterThan(0, $retryWindow->seconds);
    }

    public function test_an_empty_suite_fails_the_run(): void
    {
        $this->assertStringContainsString('failOnEmptyTestSuite="true"', (string) file_get_contents(base_path('phpunit.xml')));
    }

    public function test_the_dependency_inventory_lists_every_declared_edge(): void
    {
        $inventory = (string) file_get_contents(base_path('docs/hooks/dependencies.md'));

        foreach ($this->app->make(DomainRegistry::class)->all() as $entry) {
            foreach ($entry->requires as $required) {
                $this->assertStringContainsString("| {$entry->name} | ".DomainEntry::nameOf($required).' |', $inventory);
            }
        }
    }

    public function test_the_capability_record_names_the_pinned_versions_and_no_production_run(): void
    {
        $evidence = (string) file_get_contents(base_path('docs/hooks/program-capabilities.md'));

        $this->assertStringContainsString('| Program and pinned version | Claude Code 2.1.323,', $evidence);
        $this->assertStringContainsString('| Program and pinned version | codex-cli 0.165.0,', $evidence);
        $this->assertStringContainsString('No production program runs under it yet:', $evidence);
    }

    /**
     * @return list<string>
     */
    private function hookMethods(): array
    {
        return array_values(array_map(
            fn (ReflectionMethod $method) => $method->getName(),
            array_filter(new ReflectionClass(AgentState::class)->getMethods(), fn (ReflectionMethod $method) => str_starts_with($method->getName(), 'on')),
        ));
    }
}
