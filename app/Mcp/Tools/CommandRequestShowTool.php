<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\CommandRules\CommandRequestViews;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\ToolArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;

/**
 * Shows a held command request: its line, state, the steps it waits on and the next one, its proposals and readers.
 */
#[Name(self::NAME)]
#[VisibleToProfiles(DiscoveryProfile::MainAgent, DiscoveryProfile::WritingHelper, DiscoveryProfile::ReadOnlyHelper)]
#[Description(
    'A held command request: its line, its state, the steps it still waits on and the next one, and its proposals '
    .'and readers.',
)]
final class CommandRequestShowTool extends JournalReadTool
{
    public const string NAME = 'command_requests_show';

    public function __construct(private readonly CommandRequestViews $requests) {}

    public function schema(JsonSchema $schema): array
    {
        return ['request' => $this->recordIdArgument($schema)];
    }

    protected function read(ToolArguments $arguments): ToolResult
    {
        return ToolResult::ok($this->requests->show($arguments->ulid('request')));
    }
}
