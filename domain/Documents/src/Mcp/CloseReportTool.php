<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use Domain\Documents\Commands\CloseReport;
use Domain\Documents\Mcp\Concerns\PublicationArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive(false)]
#[Name('reports_close')]
#[Dispatches(CloseReport::class)]
#[Description('Close a report with a reason, preserving the findings.')]
#[VisibleToProfiles(DiscoveryProfile::MainAgent, DiscoveryProfile::WritingHelper, DiscoveryProfile::ReadOnlyHelper)]
final class CloseReportTool extends JournalWriteTool
{
    use PublicationArguments;

    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'report_id' => $this->referenceSchema($schema),
            'reason' => $schema->string()->max(2000)->required(),
        ];
    }

    protected function command(ToolArguments $arguments): CloseReport
    {
        return new CloseReport((string) $arguments->recordReference('report_id'), $arguments->text('reason'));
    }

    protected function present(mixed $result): ToolResult
    {
        return ToolResult::ok([]);
    }
}
