<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Mcp\Data\ToolResult;
use App\Mcp\Support\CapabilitiesResolver;
use App\Mcp\Support\ToolArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

/**
 * capabilities_read: the contract, build and protocol versions, the caller's job profile and the tools it may use.
 */
#[Name('capabilities_read')]
#[Description('The journal MCP contract version, the server build, the MCP protocol version of this request, your job profile and the tool names you may use.')]
#[IsReadOnly]
final class CapabilitiesReadTool extends JournalReadTool
{
    protected array|null $meta = ['anthropic/alwaysLoad' => true];

    public function __construct(private readonly CapabilitiesResolver $capabilities) {}

    public function outputSchema(JsonSchema $schema): array
    {
        return [
            'status' => $schema->string()->required(),
            'contract_version' => $schema->string()->required(),
            'server_build' => $schema->string()->required(),
            'protocol_version' => $schema->string()->nullable()->required(),
            'job_profile' => $schema->string()->required(),
            'tools' => $schema->array()->items($schema->string())->required(),
            'next_actions' => $schema->array()->required(),
        ];
    }

    protected function read(ToolArguments $arguments): ToolResult
    {
        return $this->capabilities->read();
    }
}
