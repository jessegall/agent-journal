<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Mcp\Contracts\McpCall;
use App\Mcp\Data\ToolResult;
use App\Mcp\Exceptions\ToolArgumentUnknown;
use App\Mcp\Support\ToolArguments;
use Illuminate\JsonSchema\JsonSchemaTypeFactory;
use Laravel\Mcp\Request;
use Laravel\Mcp\ResponseFactory;
use Laravel\Mcp\Server\Tool;

/**
 * The base of every journal tool: a strict published schema and arguments limited to the fields it declares.
 */
abstract class JournalTool extends Tool
{
    /**
     * Whether the calling job may see this tool; every job may until job permissions narrow it.
     */
    public function shouldRegister(): bool
    {
        return true;
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

    final public function handle(Request $request, McpCall $call): ResponseFactory
    {
        return $call->answerTool($this->name(), fn () => $this->answer($this->arguments($request)));
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
