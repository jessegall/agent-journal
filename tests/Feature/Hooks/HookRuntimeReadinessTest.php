<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Domain\Agents\LaunchTransaction;
use App\Domain\DomainEntry;
use App\Domain\DomainRegistry;
use App\Domain\Hooks\HookRetryWindow;
use App\Domain\Hooks\Inputs\HookIdentity;
use App\Domain\Hooks\Inputs\ShellCommandParser;
use App\Domain\Hooks\Programs\HookPayload;
use App\Domain\Hooks\Programs\HookProgram;
use App\Domain\Hooks\Programs\ProgramAdapters;
use App\Domain\Hooks\RetentionPeriods;
use App\Domain\Hooks\Stack\StateTypes;
use App\Domain\Hooks\StackTransaction;
use App\Domain\Hooks\States\AgentState;
use App\Domain\Processes\HookCommandFacts;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\DataProvider;
use ReflectionClass;
use ReflectionMethod;
use Tests\TestCase;

final class HookRuntimeReadinessTest extends TestCase
{
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

    #[DataProvider('programs')]
    public function test_every_event_the_isolated_settings_register_is_mapped_by_the_adapter(HookProgram $program): void
    {
        $adapter = $this->app->make(ProgramAdapters::class)->for($program);

        foreach ($program->nativeEvents() as $event) {
            $call = $adapter->callFor(HookPayload::from($this->minimalPayload($program, $event)), new HookIdentity(1, 10, 'call-1', hash('sha256', $event)));

            $this->assertNotNull($call, $event);
        }
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

    /**
     * @return array<string, mixed>
     */
    private function minimalPayload(HookProgram $program, string $event): array
    {
        $shellTool = $program === HookProgram::ClaudeCode ? ['tool_name' => 'Bash'] : ['tool_name' => 'shell'];

        return ['session_id' => 'session-1', 'hook_event_name' => $event, ...match ($event) {
            'SessionStart' => ['source' => 'startup'],
            'UserPromptSubmit' => ['prompt' => 'Build the walk.'],
            'PreToolUse' => [...$shellTool, 'tool_input' => ['command' => 'git status']],
            'PostToolUse' => [...$shellTool, 'tool_input' => ['command' => 'git status'], 'tool_response' => []],
            'Stop' => ['stop_hook_active' => false],
            'SessionEnd' => ['reason' => 'other'],
            default => [],
        }];
    }
}
