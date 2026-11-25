<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp\Tools;

use App\Attributes\Bus\Dispatches;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use Domain\Documents\Commands\CreateReport\CreateReportCommand;
use Domain\Documents\Support\Mcp\Concerns\PublicationArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive(false)]
#[Name('reports_create')]
#[Dispatches(CreateReportCommand::class)]
#[Description('File a report from text or one sealed upload.')]
#[VisibleToProfiles(DiscoveryProfile::MainAgent, DiscoveryProfile::WritingHelper, DiscoveryProfile::ReadOnlyHelper)]
final class CreateReportTool extends JournalWriteTool
{
    use PublicationArguments;

    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'title' => $schema->string()->max(240)->required(),
            'abstract' => $schema->string()->max(1000)->required(),
            'body' => $schema->string(),
            'upload_id' => $this->optionalRecordIdArgument($schema),
            'source_references' => $schema->array()->items($schema->string()->max(128))->max(50),
        ];
    }

    protected function command(ToolArguments $arguments): CreateReportCommand
    {
        return new CreateReportCommand(
            $arguments->text('title'),
            $arguments->text('abstract'),
            $arguments->optionalText('body'),
            $this->sources($arguments),
            $arguments->optionalUlid('upload_id'),
        );
    }

    protected function present(mixed $createdReport): ToolResult
    {
        return ToolResult::ok([
            'report_id' => $createdReport->number,
            'record_id' => $createdReport->id,
        ]);
    }
}
