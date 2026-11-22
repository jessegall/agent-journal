<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use Domain\Documents\Commands\AppendUpload\AppendUploadCommand;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive(false)]
#[Name('uploads_append')]
#[Dispatches(AppendUploadCommand::class)]
#[Description('Append one UTF-8 chunk at the next zero-based index.')]
#[VisibleToProfiles(DiscoveryProfile::MainAgent, DiscoveryProfile::WritingHelper, DiscoveryProfile::ReadOnlyHelper)]
final class AppendUploadTool extends JournalWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'upload_id' => $schema->string()->max(26)->required(),
            'index' => $schema->integer()->min(0)->required(),
            'text' => $schema->string()->min(1)->max(AppendUploadCommand::MAX_BYTES)->required(),
            'digest' => $schema->string()->min(64)->max(64)->required(),
        ];
    }

    protected function command(ToolArguments $arguments): AppendUploadCommand
    {
        return new AppendUploadCommand(
            $arguments->ulid('upload_id'),
            $arguments->wholeNumber('index'),
            $arguments->text('text'),
            $arguments->text('digest'),
        );
    }

    protected function present(mixed $commandResult): ToolResult
    {
        return ToolResult::ok([]);
    }
}
