<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp\Tools;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use Domain\Documents\Commands\CommitUpload\CommitUploadCommand;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive(false)]
#[Name('uploads_commit')]
#[Dispatches(CommitUploadCommand::class)]
#[Description('Verify all bytes and seal the upload.')]
#[VisibleToProfiles(DiscoveryProfile::MainAgent, DiscoveryProfile::WritingHelper, DiscoveryProfile::ReadOnlyHelper)]
final class CommitUploadTool extends JournalWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'upload_id' => $this->recordIdArgument($schema),
        ];
    }

    protected function command(ToolArguments $arguments): CommitUploadCommand
    {
        return new CommitUploadCommand($arguments->ulid('upload_id'));
    }

    protected function present(mixed $attachmentId): ToolResult
    {
        return ToolResult::ok(['attachment_id' => $attachmentId]);
    }
}
