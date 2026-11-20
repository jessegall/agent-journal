<?php

declare(strict_types=1);

namespace App\Assignments\Mcp;

use App\Actors\Enums\ActorType;
use App\Assignments\Support\AssigneeIdentity;
use App\Assignments\Support\AssignmentReference;
use App\Assignments\Support\AssignmentResult;
use App\Mcp\Data\ToolResult;
use App\Mcp\Exceptions\ToolArgumentInvalid;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use App\Records\Support\RecordIdentity;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\ObjectType;
use Illuminate\JsonSchema\Types\Type;

/** Maps single-record assignment arguments and outcomes for MCP. */
abstract class AssignmentWriteTool extends JournalWriteTool
{
    /** @return array<string, Type> */
    final protected function recordSchema(JsonSchema $schema): array
    {
        return [
            'record_type' => $schema->string()->max(100)->required(),
            'record_id' => $schema->string()->max(26)->required(),
        ];
    }

    final protected function assigneeSchema(JsonSchema $schema): ObjectType
    {
        return $schema->object([
            'type' => $schema->string()->enum(array_column(ActorType::requestTypes(), 'value'))->required(),
            'id' => $schema->string()->max(26)->required(),
        ])->withoutAdditionalProperties()->required();
    }

    final protected function expectedSchema(JsonSchema $schema): ObjectType
    {
        return $schema->object([
            'id' => $schema->string()->max(26)->required(),
            'holder' => $this->assigneeSchema($schema),
        ])->withoutAdditionalProperties()->required();
    }

    final protected function record(ToolArguments $arguments): RecordIdentity
    {
        return new RecordIdentity($arguments->text('record_type'), $arguments->ulid('record_id'));
    }

    final protected function recipient(ToolArguments $arguments): AssigneeIdentity
    {
        return $this->assignee($arguments->object('recipient', ['type', 'id']));
    }

    final protected function expected(ToolArguments $arguments): AssignmentReference
    {
        $expected = $arguments->object('expected_assignment', ['id', 'holder']);

        return new AssignmentReference(
            $expected->ulid('id'),
            $this->assignee($expected->object('holder', ['type', 'id'])),
        );
    }

    /** @param AssignmentResult $result */
    final protected function present(mixed $result): ToolResult
    {
        $outcome = $result->outcomes[0];

        return ToolResult::ok([
            'outcome' => $outcome->type->value,
            'changed' => count($result->changes),
            'assignment' => $outcome->current?->reference->toArray(),
        ]);
    }

    private function assignee(ToolArguments $arguments): AssigneeIdentity
    {
        $type = $arguments->enum('type', ActorType::class);

        if (! in_array($type, ActorType::requestTypes(), true)) {
            throw ToolArgumentInvalid::for('type', 'an agent or user');
        }

        return new AssigneeIdentity($type->value, $arguments->ulid('id'));
    }
}
