<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Core\Agents\LaunchTransaction;
use App\Core\Hooks\HookRetryWindow;
use App\Core\Hooks\Inputs\HookIdentity;
use App\Core\Hooks\Inputs\ShellCommandParser;
use App\Core\Hooks\Programs\HookPayload;
use App\Core\Hooks\Programs\HookProgram;
use App\Core\Hooks\Programs\NativeCall;
use App\Core\Hooks\Programs\ProgramAdapters;
use App\Core\Hooks\RetentionPeriods;
use App\Core\Hooks\Stack\StateTypes;
use App\Core\Hooks\StackTransaction;
use App\Core\Hooks\States\AgentState;
use App\Domain\DomainEntry;
use App\Domain\DomainRegistry;
use App\Domain\Processes\HookCommandFacts;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\DataProvider;
use ReflectionClass;
use ReflectionMethod;
use Tests\TestCase;

final class HookRuntimeReadinessTest extends TestCase
{
    private const SHELL_CALL = ['tool_input' => ['command' => 'git status'], 'tool_response' => []];

    private const EVENT_FIELDS = [
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
            'PreToolUse' => ['tool_name' => 'shell', ...self::SHELL_CALL],
            'PostToolUse' => ['tool_name' => 'shell', ...self::SHELL_CALL],
            'Stop' => ['stop_hook_active' => false],
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

        $call = $this->app->make(ProgramAdapters::class)->for($program)->callFor($payload, new HookIdentity(1, 10, 'call-1', hash('sha256', $event)));

        $this->assertInstanceOf(NativeCall::class, $call);
    }

    public function test_the_runtime_binds_the_real_parser_launch_transaction_and_state_types(): void
    {
        $registry = $this->app->make(StateTypes::class)->registry();

        $this->assertInstanceOf(HookCommandFacts::class, $this->app->make(ShellCommandParser::class));
        $this->assertInstanceOf(StackTransaction::class, $this->app->make(LaunchTransaction::class));

        foreach (['hooks.main_ready', 'hooks.read_only_helper_ready', 'tasks.working', 'chat.answering', 'sequences.following'] as $typeKey) {
            $this->assertTrue($registry->has($typeKey), $typeKey);
        }
    }

    public function test_the_configured_limits_hold_together(): void
    {
        $retryWindow = $this->app->make(HookRetryWindow::class);

        $this->app->make(RetentionPeriods::class)->checkLongerThan($retryWindow);
        $this->assertLessThanOrEqual(300, $retryWindow->seconds);
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

    public function test_the_capability_record_claims_no_verified_program_version(): void
    {
        $evidence = (string) file_get_contents(base_path('docs/hooks/program-capabilities.md'));

        $this->assertSame(2, substr_count($evidence, '| Program and pinned version | not verified |'));
        $this->assertStringContainsString('No production program runs under it yet.', $evidence);
    }

    /**
     * @return list<string>
     */
    private function hookMethods(): array
    {
        return array_values(array_map(
            fn (ReflectionMethod $method) => $method->getName(),
            array_filter((new ReflectionClass(AgentState::class))->getMethods(), fn (ReflectionMethod $method) => str_starts_with($method->getName(), 'on')),
        ));
    }
}
