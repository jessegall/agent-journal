<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Exceptions\ToolArgumentUnknown;
use App\Mcp\Support\JobPermissionReader;
use App\Mcp\Support\ToolArguments;
use Illuminate\JsonSchema\JsonSchemaTypeFactory;
use Laravel\Mcp\Request;
use Laravel\Mcp\Server\Tool;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;
use ReflectionClass;

/**
 * The base of every journal tool: a strict published schema and arguments limited to the fields it declares.
 */
abstract class JournalTool extends Tool
{
    final public function shouldRegister(JobPermissionReader $permissions): bool
    {
        return $permissions->allows($this);
    }

    /**
     * @return Option<Dispatches>
     */
    final public function writeDeclaration(): Option
    {
        foreach (new ReflectionClass($this)->getAttributes(Dispatches::class) as $declaration) {
            return new Some($declaration->newInstance());
        }

        return None::create();
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        $tool = parent::toArray();
        $tool['inputSchema']['additionalProperties'] = false;

        return $tool;
    }

    /**
     * @throws ToolArgumentUnknown
     */
    protected function arguments(Request $request): ToolArguments
    {
        return ToolArguments::read($this->name(), $request, array_keys($this->schema(new JsonSchemaTypeFactory())));
    }
}
