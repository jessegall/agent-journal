<?php

declare(strict_types=1);

namespace Tests\Architecture\Support\EntryPoints;

use App\Contracts\Files\Files;
use App\Enums\Files\Place;
use App\Mcp\Support\McpCatalogue;
use App\Mcp\Tools\JournalTool;
use App\Mcp\Tools\JournalWriteTool;
use App\Support\Reflector;
use App\Values\FilePath;
use Illuminate\Http\Request;
use Illuminate\Routing\Router;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\DeclaredCommands;

/**
 * The entry test file of every route method and MCP tool, as the generator writes it from the template: the attribute
 * naming its entry, the base its caller needs and an arrangement. The arrangement is complete only for a route with no
 * parameters whose action sends nothing, or a read tool with no required argument; any other throws, naming what is
 * still to fill in, and a route a page request was recorded for names that recording.
 */
final readonly class EntryTestFiles
{
    private const string TEMPLATE = 'tests/Architecture/Support/EntryPoints/entry-test.php.template';

    private const string RECORDINGS = 'tests/Contracts/page-requests';

    private const array METHODS = [
        'GET',
        'POST',
        'PUT',
        'PATCH',
        'DELETE',
    ];

    public function __construct(
        private RouteEntries $routes,
        private Router $router,
        private McpCatalogue $tools,
        private Files $files,
    ) {}

    /**
     * @return list<EntryTestFile>
     */
    public function all(): array
    {
        $recordings = $this->recordings();

        return [
            ...array_map(fn (RouteMethod $method) => $this->routeFile($method, $recordings), $this->routes->methods()),
            ...array_map($this->toolFile(...), $this->tools->toolClasses()),
        ];
    }

    /**
     * @param  array<string, string>  $recordings  each recorded page request's name, by the route method it reaches
     */
    private function routeFile(RouteMethod $method, array $recordings): EntryTestFile
    {
        $caller = Caller::of($method->route->gatherMiddleware());
        $missing = [
            ...array_map(fn (string $parameter) => "{{$parameter}}", $method->route->parameterNames()),
            ...($method->method === 'GET' ? [] : ['the payload']),
            ...(DeclaredCommands::ofRoute($method->route) === [] ? [] : ['the expected commands']),
            ...match ($caller) {
                Caller::RelayHost => ['the relay that signs'],
                Caller::DeviceGrant => ['the device grant token'],
                default => [],
            },
            ...(array_key_exists($method->entryName(), $recordings)
                ? ["the ids of the recorded page request {$recordings[$method->entryName()]}"]
                : []),
        ];
        $base = $caller->isGuarded() ? 'GuardedRouteEntryTestCase' : 'RouteEntryTestCase';
        $imports = [
            'Tests\\Support\\Entries\\Attributes\\Generated',
            'Tests\\Support\\Entries\\Attributes\\TestsRoute',
            "Tests\\Support\\Entries\\{$base}",
            'Tests\\Support\\Entries\\RouteCall',
            'Tests\\Support\\Seeding\\TestJournal',
            ...($missing === [] ? ['Tests\\Support\\Entries\\Caller'] : []),
        ];

        return new EntryTestFile(EntryType::Route, $method->entryName(), $method->testFile(), $this->text(
            $method->testNamespace(),
            $imports,
            $method->entryName(),
            "TestsRoute('{$method->method}', '{$method->name()}')",
            $method->testClass(),
            $base,
            $method->owner,
            'RouteCall',
            $missing === [] ? self::completeRouteCall($caller) : self::throwing($method->entryName(), $missing),
        ));
    }

    /**
     * @param  class-string<JournalTool>  $tool
     */
    private function toolFile(string $tool): EntryTestFile
    {
        $short = Reflector::of($tool)->shortName();
        $owner = preg_match('/^(Domain\\\\[^\\\\]+)\\\\/', $tool, $domain) === 1 ? $domain[1] : 'App';
        $namespace = $owner === 'App' ? 'Tests\\Mcp' : "{$owner}\\Tests\\Mcp";
        $required = $this->tools->requiredArgumentsOf($tool);
        $missing = [
            ...array_map(fn (string $argument) => "the argument {$argument}", $required),
            ...(Reflector::of($tool)->isSubclassOf(JournalWriteTool::class)
                ? ['the expected commands', 'the sink replies']
                : []),
        ];
        $arrangement = $missing === []
            ? "        return ToolCall::by(\$journal->owner()->signedStart('Agent'));"
            : self::throwing($short, $missing);

        return new EntryTestFile(
            EntryType::McpTool,
            $tool,
            EntryPoint::folderOf($tool, EntryType::McpTool)."/{$short}Test.php",
            $this->text(
                $namespace,
                [
                    $tool,
                    'Tests\\Support\\Entries\\Attributes\\Generated',
                    'Tests\\Support\\Entries\\Attributes\\TestsMcpTool',
                    'Tests\\Support\\Entries\\McpToolEntryTestCase',
                    'Tests\\Support\\Entries\\ToolCall',
                    'Tests\\Support\\Seeding\\TestJournal',
                ],
                "the tool {$short}",
                "TestsMcpTool({$short}::class)",
                "{$short}Test",
                'McpToolEntryTestCase',
                $owner,
                'ToolCall',
                $arrangement,
            ),
        );
    }

    /**
     * The class text: the template with each part in place, a domain's test booting that domain.
     *
     * @param  list<string>  $imports
     */
    private function text(
        string $namespace,
        array $imports,
        string $entry,
        string $attribute,
        string $class,
        string $base,
        string $owner,
        string $call,
        string $arrangement,
    ): string {
        $booted = '';

        if ($owner !== 'App') {
            $domain = substr($owner, strlen('Domain\\'));
            $imports = [...$imports, "{$owner}\\{$domain}Domain", 'Tests\\Support\\DomainBoot'];
            $booted = <<<PHP
                    protected static function bootedDomains(): array
                    {
                        return DomainBoot::withRequirements({$domain}Domain::class);
                    }


                PHP;
        }

        if (str_contains($arrangement, 'EntryTestNeedsArrangement')) {
            $imports[] = 'Tests\\Support\\Entries\\Exceptions\\EntryTestNeedsArrangement';
        }

        sort($imports);

        return strtr($this->files->read(FilePath::in(Place::Project, self::TEMPLATE)), [
            '{namespace}' => $namespace,
            '{imports}' => implode("\n", array_map(fn (string $import) => "use {$import};", array_unique($imports))),
            '{entry}' => $entry,
            '{attribute}' => $attribute,
            '{class}' => $class,
            '{base}' => $base,
            '{booted}' => $booted,
            '{call}' => $call,
            '{arrangement}' => $arrangement,
        ]);
    }

    private static function completeRouteCall(Caller $caller): string
    {
        return match ($caller) {
            Caller::Agent => "        return RouteCall::as(Caller::Agent, \$journal->owner()->signedStart('Agent'));",
            Caller::SharedHost => '        return RouteCall::as(Caller::SharedHost, $journal->owner()->enrolledHost());',
            Caller::Guest, Caller::Public => "        return RouteCall::as(Caller::{$caller->name});",
            default => "        \$journal->owner();\n\n        return RouteCall::as(Caller::{$caller->name});",
        };
    }

    /**
     * @param  list<string>  $missing
     */
    private static function throwing(string $entry, array $missing): string
    {
        $items = implode("\n", array_map(fn (string $item) => "            '{$item}',", $missing));

        return <<<PHP
                    throw EntryTestNeedsArrangement::for('{$entry}', [
            {$items}
                    ]);
            PHP;
    }

    /**
     * The name of each recorded page request, by the route method its address reaches.
     *
     * @return array<string, string>
     */
    private function recordings(): array
    {
        $recordings = [];
        $folder = FilePath::in(Place::Project, self::RECORDINGS);

        foreach ($this->files->list($folder, pattern: '*.json')->paths() as $file) {
            /** @var array{method: string, url: string} $request */
            $request = $this->files->readJson($file);

            if (in_array($request['method'], self::METHODS, true)) {
                $route = $this->router->getRoutes()->match(Request::create($request['url'], $request['method']));
                $recordings["{$request['method']} {$route->getName()}"] = basename($file->relative, '.json');
            }
        }

        return $recordings;
    }
}
