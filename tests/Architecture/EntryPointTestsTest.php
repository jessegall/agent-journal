<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Contracts\Processes\ShellCommandParser;
use App\Mcp\Support\McpCatalogue;
use App\Support\ClientDeclarations;
use App\Support\CommandRegistry;
use App\Support\Drivers\Contracts\DriverAdapters;
use App\Support\StateCatalog\Contracts\StateTypes;
use Illuminate\Routing\Router;
use SimpleXMLElement;
use Tests\Architecture\Support\EntryPoints\CommandEntries;
use Tests\Architecture\Support\EntryPoints\EntryAttributes;
use Tests\Architecture\Support\EntryPoints\EntryPoint;
use Tests\Architecture\Support\EntryPoints\EntryTestFindings;
use Tests\Architecture\Support\EntryPoints\EntryType;
use Tests\Architecture\Support\EntryPoints\HookEntries;
use Tests\Architecture\Support\EntryPoints\LoaderEntries;
use Tests\Architecture\Support\EntryPoints\McpToolEntries;
use Tests\Architecture\Support\EntryPoints\MiddlewareEntries;
use Tests\Architecture\Support\EntryPoints\NamedEntry;
use Tests\Architecture\Support\EntryPoints\RouteEntries;
use Tests\Architecture\Support\EntryPoints\StateEntries;
use Tests\Fixtures\Hooks\ListedCommandParser;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * Every way into the journal is read from the booted code, every entry a test names from the Tests attributes of the
 * test classes, and the two are compared: a test names only entries that exist, one of its kind where a kind has one
 * test each, from the place its kind's tests belong, in a folder the test suites run; every read has its test, every
 * journal route has a name, every native hook event a HookEvent case, and the routes of other controllers are the ones listed here.
 */
#[TimeLimit(seconds: 60, reason: 'It reads the attributes of every test class of core and the domains.')]
final class EntryPointTestsTest extends TestCase
{
    /**
     * The routes of controllers outside the journal, such as Fortify's, the MCP server's and the broadcast auth, by
     * method and address.
     */
    private const array VENDOR_ROUTES = [
        'DELETE agent/mcp/v1',
        'GET agent/mcp/v1',
        'GET broadcasting/auth',
        'GET storage/{path}',
        'GET up',
        'GET user/confirmed-password-status',
        'POST agent/mcp/v1',
        'POST broadcasting/auth',
        'POST login',
        'POST logout',
        'POST user/confirm-password',
        'PUT storage/{path}',
    ];

    private const string SUITE = 'Entry';

    public function test_every_entry_a_test_names_exists(): void
    {
        $entries = $this->entries();
        $missing = array_filter(
            $this->named(),
            fn (NamedEntry $named) => array_filter($entries, $named->isFor(...)) === [],
        );

        $this->assertSame([], [
            ...array_map(
                fn (NamedEntry $named) => "{$named->file} names the {$named->type->value} {$named->name}, which does "
                    .'not exist: delete the test, or name what it tests.',
                $missing,
            ),
            ...$this->attributes()->unloadable(),
        ]);
    }

    public function test_a_command_state_tool_or_middleware_test_names_one_of_its_kind(): void
    {
        $counts = [];

        foreach ($this->named() as $named) {
            if ($named->type->isOnePerTest()) {
                $key = "{$named->file} names more than one {$named->type->value}: give each its own test.";
                $counts[$key] = ($counts[$key] ?? 0) + 1;
            }
        }

        $this->assertSame([], array_keys(array_filter($counts, fn (int $count) => $count > 1)));
    }

    public function test_each_test_sits_where_its_kinds_tests_belong(): void
    {
        $this->assertSame([], $this->findings()->misplaced());
    }

    public function test_every_read_has_its_test(): void
    {
        $this->assertSame([], $this->findings()->untestedReads());
    }

    public function test_every_folder_of_entry_tests_is_in_a_test_suite(): void
    {
        $configuration = new SimpleXMLElement((string) file_get_contents(base_path('phpunit.xml')));
        $listed = array_map(
            fn (SimpleXMLElement $directory) => (string) $directory,
            $configuration->xpath('//testsuites/testsuite/directory') ?: [],
        );
        $unlisted = [];

        foreach (EntryType::cases() as $type) {
            $folders = $type->hasDomainFolder()
                ? ["tests/{$type->folder()}", "domain/*/tests/{$type->folder()}"]
                : ["tests/{$type->folder()}"];

            foreach (array_diff($folders, $listed) as $folder) {
                $unlisted[] = "Add {$folder} to the ".self::SUITE.' suite of phpunit.xml.';
            }
        }

        $this->assertSame([], $unlisted);
    }

    public function test_every_journal_route_is_named(): void
    {
        $this->assertSame([], array_map(
            fn (string $route) => "Name the route {$route}.",
            $this->routes()->unnamed(),
        ));
    }

    public function test_every_native_hook_event_has_its_hook_event(): void
    {
        $this->assertSame([], array_map(
            fn (string $event) => "The protocol and event {$event} has no case: add the case to HookEvent.",
            $this->hooks()->unknownEvents(),
        ));
    }

    public function test_the_routes_of_other_controllers_are_the_listed_ones(): void
    {
        $this->assertSame(self::VENDOR_ROUTES, $this->routes()->vendor());
    }

    /**
     * @return list<EntryPoint>
     */
    private function entries(): array
    {
        return [
            ...new CommandEntries($this->app->make(CommandRegistry::class))->entries(),
            ...new StateEntries($this->app->make(StateTypes::class))->entries(),
            ...$this->routes()->entries(),
            ...new McpToolEntries($this->app->make(McpCatalogue::class))->entries(),
            ...$this->hooks()->entries(),
            ...new MiddlewareEntries($this->app->make(CommandRegistry::class))->entries(),
            ...new LoaderEntries()->entries(),
        ];
    }

    private function findings(): EntryTestFindings
    {
        return new EntryTestFindings($this->entries(), $this->named());
    }

    /**
     * @return list<NamedEntry>
     */
    private function named(): array
    {
        return $this->attributes()->named();
    }

    private function attributes(): EntryAttributes
    {
        return new EntryAttributes(base_path());
    }

    /**
     * The hook moments, read from adapters whose shell parser is the listed one: only their protocols and events are
     * read, and the real parser reads the project's rules from the database.
     */
    private function hooks(): HookEntries
    {
        $this->app->instance(ShellCommandParser::class, new ListedCommandParser());

        return new HookEntries($this->app->make(DriverAdapters::class));
    }

    private function routes(): RouteEntries
    {
        return new RouteEntries($this->app->make(Router::class), $this->app->make(ClientDeclarations::class));
    }
}
