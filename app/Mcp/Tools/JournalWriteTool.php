<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\RequestKey;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Contracts\McpCall;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\ToolArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\ResponseFactory;

/**
 * A journal tool that changes something: it hands its checked arguments to one bus command and answers with the
 * receipt; a refusal of that command is the tool's refusal.
 */
#[VisibleToProfiles(DiscoveryProfile::MainAgent, DiscoveryProfile::WritingHelper)]
abstract class JournalWriteTool extends JournalTool
{
    final public function schema(JsonSchema $schema): array
    {
        return [
            ...$this->writeSchema($schema),
            'request_key' => $schema->string()->max(RequestKey::LONGEST)->required(),
        ];
    }

    final public function handle(Request $request, CommandBus $bus, RequestKey $key, McpCall $call): ResponseFactory
    {
        return $call->answerTool($this->name(), function () use ($request, $bus, $key): ToolResult {
            $arguments = $this->arguments($request);
            $key->set($arguments->text('request_key'));

            try {
                return $this->present($bus->run($this->command($arguments)));
            } finally {
                $key->forget();
            }
        });
    }

    /**
     * @return array<string, \Illuminate\JsonSchema\Types\Type>
     */
    abstract protected function writeSchema(JsonSchema $schema): array;

    /**
     * @return Command<mixed>
     */
    abstract protected function command(ToolArguments $arguments): Command;

    abstract protected function present(mixed $commandReply): ToolResult;
}
