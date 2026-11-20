<?php

declare(strict_types=1);

namespace Tests\Fixtures\Mcp;

use App\Mcp\Data\NextAction;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalReadTool;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;
use Tests\Fixtures\Mcp\Exceptions\FixtureReaderBroke;
use Tests\Fixtures\Mcp\Exceptions\FixtureRecordUnavailable;

/**
 * A read tool whose answer the test chooses: a record, a coded refusal, an unexpected failure or a result too large.
 */
#[IsReadOnly]
#[Name('fixture_read')]
#[Description('Reads a fixture record.')]
final class FixtureReadTool extends JournalReadTool
{
    public function schema(JsonSchema $schema): array
    {
        return [
            'number' => $schema->integer()->min(1)->required(),
            'answer' => $schema->string()->enum(['record', 'refused', 'broken', 'large'])->required(),
        ];
    }

    protected function read(ToolArguments $arguments): ToolResult
    {
        $number = $arguments->positiveInteger('number');

        return match ($arguments->text('answer')) {
            'refused' => throw FixtureRecordUnavailable::for($number),
            'broken' => throw FixtureReaderBroke::withSecret(),
            'large' => ToolResult::ok(['body' => str_repeat('a', 20 * 1024)], []),
            default => ToolResult::ok(
['number' => $number],
 [new NextAction('fixture_read', ['number' => $number + 1, 'answer' => 'record'])],
),
        };
    }
}
