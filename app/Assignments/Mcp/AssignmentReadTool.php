<?php

declare(strict_types=1);

namespace App\Assignments\Mcp;

use App\Assignments\Contracts\AssigneeReader;
use App\Assignments\Contracts\AssignmentReader;
use App\Assignments\Support\AssignmentData;
use App\Assignments\Support\AssignmentHolder;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalReadTool;
use App\Records\Contracts\RecordReader;
use App\Records\Support\RecordIdentity;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

/**
 * assignments_read: who holds one record, with the assignment reference a deliberate change must name.
 */
#[Name('assignments_read')]
#[Description('Who holds one record, such as tasks.task with its id, and the assignment reference a reassign or unassign must name; holder is null when nobody holds it.')]
#[IsReadOnly]
final class AssignmentReadTool extends JournalReadTool
{
    public function __construct(
        private readonly AssignmentReader $assignments,
        private readonly AssigneeReader $assignees,
        private readonly RecordReader $records,
    ) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            'record_type' => $schema->string()->max(100)->description('A registered record type such as tasks.task, plans.plan or plans.phase.')->required(),
            'record_id' => $schema->string()->max(26)->required(),
        ];
    }

    protected function read(ToolArguments $arguments): ToolResult
    {
        $record = new RecordIdentity($arguments->text('record_type'), $arguments->text('record_id'));
        $holders = $this->assignees->holdersOf($this->assignments->assignmentsFor([$record]));
        $this->records->requireReadable($record);

        return new ToolResult('ok', [
            'record_type' => $record->type,
            'record_id' => $record->id,
            'holder' => $holders->forRecord($record)->map(fn (AssignmentHolder $holder): array => AssignmentData::ofHolder($holder)->toArray())->getOrElse(null),
        ], []);
    }
}
