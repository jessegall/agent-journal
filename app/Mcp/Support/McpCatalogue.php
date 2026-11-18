<?php

declare(strict_types=1);

namespace App\Mcp\Support;

use App\Mcp\Contracts\McpRegistration;
use App\Mcp\Contracts\OverviewContribution;
use App\Mcp\Exceptions\McpBudgetExceeded;
use App\Mcp\Exceptions\McpClassInvalid;
use App\Mcp\Exceptions\McpResourceUriTaken;
use App\Mcp\Exceptions\McpToolNameInvalid;
use App\Mcp\Exceptions\McpToolNameTaken;
use App\Mcp\Resources\JournalResource;
use App\Mcp\Tools\JournalTool;
use Laravel\Mcp\Server\Attributes\Name;
use ReflectionClass;

/**
 * Every MCP tool, resource and overview contribution class Core and the domains offer, checked as each is added: one
 * class per tool name and resource URI, snake_case tool names, and the main profile's discovery budget. It holds class
 * names and their sizes only, never a tool built to answer a call.
 */
final class McpCatalogue implements McpRegistration
{
    private const string MAIN_PROFILE = 'main';

    private const int MAIN_TOOLS = 72;

    private const int MAIN_BYTES = 65536;

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

    private int $toolBytes = 0;

    /**
     * @throws McpClassInvalid
     * @throws McpToolNameInvalid
     * @throws McpToolNameTaken
     * @throws McpBudgetExceeded
     */
    public function registerTool(string $className): void
    {
        if (! is_subclass_of($className, JournalTool::class)) {
            throw McpClassInvalid::for($className, JournalTool::class);
        }

        $name = $this->toolName($className);

        if (array_key_exists($name, $this->tools)) {
            throw McpToolNameTaken::for($name, $this->tools[$name], $className);
        }

        $this->tools[$name] = $className;
        $this->toolBytes += strlen(json_encode($this->definitionOf($className)->toArray(), JSON_THROW_ON_ERROR));

        if (count($this->tools) > self::MAIN_TOOLS) {
            throw McpBudgetExceeded::tools(self::MAIN_PROFILE, count($this->tools), self::MAIN_TOOLS);
        }

        if ($this->toolBytes > self::MAIN_BYTES) {
            throw McpBudgetExceeded::bytes(self::MAIN_PROFILE, $this->toolBytes, self::MAIN_BYTES);
        }
    }

    /**
     * @throws McpClassInvalid
     * @throws McpResourceUriTaken
     */
    public function registerResource(string $className): void
    {
        if (! is_subclass_of($className, JournalResource::class)) {
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
        if (! is_subclass_of($className, OverviewContribution::class)) {
            throw McpClassInvalid::for($className, OverviewContribution::class);
        }

        $this->overviewContributions[] = $className;
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
     * @return list<class-string<OverviewContribution>>
     */
    public function overviewContributionClasses(): array
    {
        return $this->overviewContributions;
    }

    /**
     * @param  class-string<JournalTool>  $className
     *
     * @throws McpToolNameInvalid
     */
    private function toolName(string $className): string
    {
        $attributes = (new ReflectionClass($className))->getAttributes(Name::class);

        if ($attributes === []) {
            throw McpToolNameInvalid::missing($className);
        }

        $name = $attributes[0]->newInstance()->value;

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
        return (new ReflectionClass($className))->newInstanceWithoutConstructor();
    }
}
