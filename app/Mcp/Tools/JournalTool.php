<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Agents\Support\ReadGrant;
use App\Mcp\Attributes\WritesCommand;
use App\Mcp\Contracts\McpCall;
use App\Mcp\Data\ToolResult;
use App\Mcp\Exceptions\ToolArgumentUnknown;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Support\JobPermissionReader;
use Illuminate\JsonSchema\JsonSchemaTypeFactory;
use Laravel\Mcp\Request;
use Laravel\Mcp\ResponseFactory;
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
     * @return Option<WritesCommand>
     */
    final public function writeDeclaration(): Option
    {
        foreach (new ReflectionClass($this)->getAttributes(WritesCommand::class) as $declaration) {
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

    final public function handle(Request $request, McpCall $call, ReadGrant $reads): ResponseFactory
    {
        return $call->answerTool($this->name(), function () use ($request, $reads): ToolResult {
            $arguments = $this->arguments($request);

            if ($this instanceof JournalReadTool) {
                $reads->requireAllowed($this->readRequest($arguments));
            }

            return $this->answer($arguments);
        });
    }

    /**
     * What the tool answers for its checked arguments.
     */
    abstract protected function answer(ToolArguments $arguments): ToolResult;

    /**
     * @throws ToolArgumentUnknown
     */
    protected function arguments(Request $request): ToolArguments
    {
        return ToolArguments::read($this->name(), $request, array_keys($this->schema(new JsonSchemaTypeFactory())));
    }
}
