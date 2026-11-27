<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp\Tools;

use App\Bus\Attributes\Dispatches;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use App\Projects\Contracts\ProjectDestination;
use Domain\Documents\Commands\BeginUpload\BeginUploadCommand;
use Domain\Documents\Enums\UploadType;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;
use PhpOption\None;

#[IsIdempotent]
#[IsDestructive(false)]
#[Name('uploads_begin')]
#[Dispatches(BeginUploadCommand::class)]
#[Description('Start a private text upload with its size and SHA-256 digest.')]
#[VisibleToProfiles(DiscoveryProfile::MainAgent, DiscoveryProfile::WritingHelper, DiscoveryProfile::ReadOnlyHelper)]
final class BeginUploadTool extends JournalWriteTool
{
    public function __construct(private readonly ProjectDestination $destination) {}

    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'type' => $this->caseArgument($schema, UploadType::class)->required(),
            'bytes' => $this->wholeNumberArgument($schema, BeginUploadCommand::MAX_BYTES)->required(),
            'digest' => $schema->string()->min(64)->max(64)->required(),
        ];
    }

    protected function command(ToolArguments $arguments): BeginUploadCommand
    {
        return new BeginUploadCommand(
            $arguments->enum('type', UploadType::class),
            $arguments->positiveInteger('bytes', BeginUploadCommand::MAX_BYTES),
            $arguments->text('digest'),
            $this->projectId(),
        );
    }

    protected function present(mixed $uploadId): ToolResult
    {
        return ToolResult::ok(['upload_id' => $uploadId]);
    }

    /**
     * The calling agent's project, where the upload's document will belong.
     */
    private function projectId(): string
    {
        return $this->destination->projectFor(None::create());
    }
}
