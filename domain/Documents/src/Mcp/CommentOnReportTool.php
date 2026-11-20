<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use Domain\Documents\Commands\CommentOnReport;
use Domain\Documents\Mcp\Concerns\PublicationArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[Name('reports_comment')]
#[Description('Add an attributed comment to a report.')]
#[IsDestructive(false)]
#[IsIdempotent]
#[Dispatches(CommentOnReport::class)]
#[VisibleToProfiles(DiscoveryProfile::MainAgent, DiscoveryProfile::WritingHelper, DiscoveryProfile::ReadOnlyHelper)]
final class CommentOnReportTool extends JournalWriteTool
{
    use PublicationArguments;

    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'report_id' => $this->referenceSchema($schema),
            'body' => $schema->string()->required(),
        ];
    }

    protected function command(ToolArguments $arguments): CommentOnReport
    {
        return new CommentOnReport((string) $arguments->recordReference('report_id'), $arguments->text('body'));
    }

    protected function present(mixed $result): ToolResult
    {
        return ToolResult::ok(['comment_id' => $result]);
    }
}
