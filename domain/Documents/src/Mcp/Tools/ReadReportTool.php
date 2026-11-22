<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp\Tools;

use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use Domain\Documents\Contracts\Reports\ReportReader;
use Domain\Documents\Enums\PublicationView;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[IsReadOnly]
#[Name('reports_read')]
#[Description('Read a report summary, body range or comments.')]
final class ReadReportTool extends PublicationReadTool
{
    public function __construct(private readonly ReportReader $reports) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            'report_id' => $this->referenceSchema($schema),
            'view' => $schema->string()->enum([
                PublicationView::Summary->value, PublicationView::Body->value, PublicationView::Comments->value,
            ]),
            ...$this->rangeSchema($schema),
        ];
    }

    protected function read(ToolArguments $arguments): ToolResult
    {
        return $this->reports->report($arguments->recordReference('report_id'), $arguments);
    }
}
