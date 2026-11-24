<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp\Tools;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use Domain\Documents\Commands\DiscardUpload\DiscardUploadCommand;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive(true)]
#[Name('uploads_discard')]
#[Dispatches(DiscardUploadCommand::class)]
#[Description('Discard a private upload and its chunks.')]
#[VisibleToProfiles(DiscoveryProfile::MainAgent, DiscoveryProfile::WritingHelper, DiscoveryProfile::ReadOnlyHelper)]
final class DiscardUploadTool extends JournalWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'upload_id' => $this->recordIdArgument($schema),
        ];
    }

    protected function command(ToolArguments $arguments): DiscardUploadCommand
    {
        return new DiscardUploadCommand($arguments->ulid('upload_id'));
    }

    protected function present(mixed $commandResult): ToolResult
    {
        return ToolResult::ok([]);
    }
}
