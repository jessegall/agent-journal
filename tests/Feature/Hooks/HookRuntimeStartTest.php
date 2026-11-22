<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Contracts\StartTransaction;
use App\Domains\Support\DomainEntry;
use App\Domains\Support\DomainRegistry;
use App\Drivers\Enums\HookDriver;
use App\Hooks\Drivers\Contracts\DriverAdapters;
use App\Hooks\Drivers\Contracts\DriverCall;
use App\Hooks\Drivers\HookPayload;
use App\Hooks\Stack\StateTypes;
use App\Hooks\States\AgentState;
use App\Hooks\Support\HookRetryWindow;
use App\Hooks\Support\RetentionPeriods;
use App\Hooks\Support\StackTransaction;
use App\Processes\Contracts\ShellCommandParser;
use App\Processes\Support\ShellParser;
use App\Reflection\Support\ReflectedMethod;
use App\Reflection\Support\Reflector;
use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestActors;
use Tests\TestCase;

final class HookRuntimeStartTest extends TestCase
{
    use RefreshHookDatabase;

    private const string INVENTORY_ROW = '| %s | %s |';

    private const array SHELL_CALL = ['tool_input' => ['command' => 'git status'], 'tool_response' => []];

    private const array EVENT_FIELDS = [
        'claude-code' => [
            'SessionStart' => ['source' => 'startup'],
            'UserPromptSubmit' => ['prompt' => 'Build the walk.'],
            'PreToolUse' => ['tool_name' => 'Bash', ...self::SHELL_CALL],
            'PostToolUse' => ['tool_name' => 'Bash', ...self::SHELL_CALL],
            'Stop' => ['stop_hook_active' => false],
            'StopFailure' => ['error' => 'rate_limit'],
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
     * @return iterable<string, array{HookDriver, string}>
     */
    public static function programEvents(): iterable
    {
        foreach (HookDriver::cases() as $driver) {
            foreach ($driver->nativeEvents() as $event) {
                yield "{$driver->value} {$event}" => [$driver, $event];
            }
        }
    }

    /**
     * @return iterable<string, array{HookDriver}>
     */
    public static function drivers(): iterable
    {
        foreach (HookDriver::cases() as $driver) {
            yield $driver->value => [$driver];
        }
    }

    #[DataProvider('drivers')]
    public function test_each_program_has_its_endpoint_and_an_adapter_mapping_only_real_hooks(
        HookDriver $driver,
    ): void {
        $capabilities = $this->app->make(DriverAdapters::class)->for($driver)->capabilities();

        $this->assertTrue(Route::has('hooks.answer'));
        $this->assertSame("/hooks/{$driver->value}", route('hooks.answer', ['driver' => $driver->value], false));
        $this->assertSame([], array_values(array_diff($capabilities->hookMethods, $this->hookMethods())));
    }

    #[DataProvider('programEvents')]
    public function test_every_event_the_isolated_settings_register_is_mapped_by_the_adapter(
        HookDriver $driver,
        string $event,
    ): void {
        $payload = HookPayload::from(
            ['session_id' => 'session-1', 'hook_event_name' => $event, ...self::EVENT_FIELDS[$driver->value][$event]],
        );

        $call = $this->app->make(DriverAdapters::class)->for($driver)->callFor(
            $payload,
            TestActors::hookIdentity(1, 10, 'call-1', hash('sha256', $event)),
        );

        $this->assertInstanceOf(DriverCall::class, $call);
    }

    public function test_the_runtime_binds_the_real_parser_start_transaction_and_state_types(): void
    {
        $registry = $this->app->make(StateTypes::class)->registry();

        $this->assertInstanceOf(ShellParser::class, $this->app->make(ShellCommandParser::class));
        $this->assertInstanceOf(StackTransaction::class, $this->app->make(StartTransaction::class));

        foreach (['hooks.ready', 'tasks.working', 'communication.answering', 'sequences.following'] as $typeKey) {
            $this->assertTrue($registry->has($typeKey), $typeKey);
        }
    }

    public function test_the_configured_limits_hold_together(): void
    {
        $retryWindow = $this->app->make(HookRetryWindow::class);

        $this->app->make(RetentionPeriods::class)->assertLongerThan($retryWindow);
        $this->assertGreaterThan(0, $retryWindow->seconds);
    }

    public function test_an_empty_suite_fails_the_run(): void
    {
        $this->assertStringContainsString(
            'failOnEmptyTestSuite="true"',
            (string) file_get_contents(base_path('phpunit.xml')),
        );
    }

    public function test_the_dependency_inventory_lists_every_declared_edge(): void
    {
        $inventory = (string) file_get_contents(base_path('docs/hooks/dependencies.md'));

        foreach ($this->app->make(DomainRegistry::class)->all() as $entry) {
            foreach ($entry->requires as $required) {
                $this->assertStringContainsString(
                    sprintf(self::INVENTORY_ROW, $entry->name, DomainEntry::nameOf($required)),
                    $inventory,
                );
            }
        }
    }

    /**
     * @return list<string>
     */
    private function hookMethods(): array
    {
        return array_values(array_map(
            fn (ReflectedMethod $method) => $method->name(),
            array_filter(
                Reflector::of(AgentState::class)->methods(),
                fn (ReflectedMethod $method) => str_starts_with($method->name(), 'on'),
            ),
        ));
    }
}
