<?php

declare(strict_types=1);

namespace App\Mcp\Support;

use App\Bus\Support\CommandRegistry;
use App\Hooks\Contracts\JournalToolNames;
use App\Mcp\Contracts\McpRegistration;
use App\Mcp\Contracts\OverviewContribution;
use App\Mcp\Contracts\SearchContribution;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Exceptions\McpClassInvalid;
use App\Mcp\Exceptions\McpCommandMissing;
use App\Mcp\Exceptions\McpResourceUriTaken;
use App\Mcp\Exceptions\McpSearchTypeTaken;
use App\Mcp\Exceptions\McpToolNameInvalid;
use App\Mcp\Exceptions\McpToolNameTaken;
use App\Mcp\Resources\JournalResource;
use App\Mcp\Tools\JournalTool;
use App\Mcp\Tools\JournalWriteTool;
use App\Records\Support\RecordIdentity;
use App\Reflection\Contracts\ReflectorFactory;
use Laravel\Mcp\Server\Attributes\Name;

/**
 * Every MCP tool, resource and overview contribution class Core and the domains offer, checked as each is added: one
 * class per tool name and resource URI, snake_case tool names, and each profile's discovery budget. It holds class
 * names and their sizes only, never a tool built to answer a call.
 */
final class McpCatalogue implements JournalToolNames, McpRegistration
{
    private const string SNAKE_CASE = '/^[a-z][a-z0-9]*(_[a-z0-9]+)*$/';

    /**
     * @var array<string, class-string<JournalTool>>
     */
    private array $tools = [];

    /**
     * @var array<string, class-string<JournalResource>>
     */
    private array $resources = [];

    /**
     * @var list<class-string<OverviewContribution>>
     */
    private array $overviewContributions = [];

    /**
     * @var array<string, class-string<SearchContribution>>
     */
    private array $searchContributions = [];

    public function __construct(
        private readonly CommandRegistry $commands,
        private readonly ReflectorFactory $reflectors,
    ) {}

    /**
     * @throws McpClassInvalid
     * @throws McpCommandMissing
     * @throws McpToolNameInvalid
     * @throws McpToolNameTaken
     */
    public function registerTool(string $className): void
    {
        if (! $this->reflectors->isSubclassOf($className, JournalTool::class)) {
            throw McpClassInvalid::for($className, JournalTool::class);
        }

        $name = $this->toolName($className);

        if (array_key_exists($name, $this->tools)) {
            throw McpToolNameTaken::for($name, $this->tools[$name], $className);
        }

        $tool = $this->definitionOf($className);
        $write = $tool->writeDeclaration();

        if ($tool instanceof JournalWriteTool && $write->isEmpty()) {
            throw McpCommandMissing::undeclared($className);
        }

        if ($write->isDefined() && ! $this->commands->has($write->get()->command)) {
            throw McpCommandMissing::for($className, $write->get()->command);
        }

        $this->tools[$name] = $className;
    }

    /**
     * @throws McpClassInvalid
     * @throws McpResourceUriTaken
     */
    public function registerResource(string $className): void
    {
        if (! $this->reflectors->isSubclassOf($className, JournalResource::class)) {
            throw McpClassInvalid::for($className, JournalResource::class);
        }

        $uri = $this->definitionOf($className)->uri();

        if (array_key_exists($uri, $this->resources)) {
            throw McpResourceUriTaken::for($uri, $this->resources[$uri], $className);
        }

        $this->resources[$uri] = $className;
    }

    /**
     * @throws McpClassInvalid
     */
    public function registerOverviewContribution(string $className): void
    {
        if (! $this->reflectors->isSubclassOf($className, OverviewContribution::class)) {
            throw McpClassInvalid::for($className, OverviewContribution::class);
        }

        $this->overviewContributions[] = $className;
    }

    public function registerSearchContribution(string $className): void
    {
        if (! $this->reflectors->isSubclassOf($className, SearchContribution::class)) {
            throw McpClassInvalid::for($className, SearchContribution::class);
        }

        $contribution = $this->reflectors->make($className)->newInstanceWithoutConstructor();
        $type = $contribution->recordType();
        RecordIdentity::assertKnownType($type);

        if (isset($this->searchContributions[$type])) {
            throw McpSearchTypeTaken::between($type, $this->searchContributions[$type], $className);
        }

        $this->searchContributions[$type] = $className;
    }

    /**
     * @return array<string, class-string<SearchContribution>>
     */
    public function searchContributionClasses(): array
    {
        return $this->searchContributions;
    }

    /**
     * @return list<class-string<JournalTool>>
     */
    public function toolClasses(): array
    {
        return array_values($this->tools);
    }

    /**
     * @return list<class-string<JournalResource>>
     */
    public function resourceClasses(): array
    {
        return array_values($this->resources);
    }

    /**
     * The names of every tool in the catalogue, in the order they were added.
     *
     * @return list<string>
     */
    public function toolNames(): array
    {
        return array_keys($this->tools);
    }

    /**
     * @return list<string>
     */
    public function toolNamesFor(JobPermissionReader $permissions): array
    {
        return array_keys(array_filter(
            $this->tools,
            fn (string $class) => $permissions->allows($this->definitionOf($class)),
        ));
    }

    /**
     * @return list<class-string<OverviewContribution>>
     */
    public function overviewContributionClasses(): array
    {
        return $this->overviewContributions;
    }

    /**
     * @return array<string, array<string, mixed>>
     */
    public function toolDefinitionsFor(DiscoveryProfile $profile): array
    {
        $definitions = [];

        foreach ($this->tools as $name => $className) {
            $tool = $this->definitionOf($className);

            if (! $tool->isVisibleTo($profile)) {
                continue;
            }

            $definition = $tool->toArray();
            $definitions[$name] = [
                'name' => $definition['name'],
                'title' => $definition['title'],
                'inputSchema' => $definition['inputSchema'],
                'outputSchema' => $definition['outputSchema'] ?? null,
            ];
        }

        return $definitions;
    }

    /**
     * @return array<string, array<string, mixed>>
     */
    public function resourceDefinitions(): array
    {
        $definitions = [];

        foreach ($this->resources as $className) {
            $resource = $this->definitionOf($className);
            $definitions[$resource->uri()] = $resource->toArray();
        }

        return $definitions;
    }

    /**
     * @param  class-string<JournalTool>  $className
     *
     * @throws McpToolNameInvalid
     */
    private function toolName(string $className): string
    {
        $declaration = $this->reflectors->make($className);

        if (! $declaration->hasAttribute(Name::class)) {
            throw McpToolNameInvalid::missing($className);
        }

        $name = $declaration->attribute(Name::class)->value;

        if (preg_match(self::SNAKE_CASE, $name) !== 1) {
            throw McpToolNameInvalid::notSnakeCase($className, $name);
        }

        return $name;
    }

    /**
     * The class read for its published definition only, built without its constructor so no reader is resolved.
     *
     * @template T of JournalTool|JournalResource
     *
     * @param  class-string<T>  $className
     * @return T
     */
    private function definitionOf(string $className): JournalTool|JournalResource
    {
        return $this->reflectors->make($className)->newInstanceWithoutConstructor();
    }
}
