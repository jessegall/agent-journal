<?php

declare(strict_types=1);

namespace App\Mcp\Tools\Concerns;

use App\Enums\ActorType;
use App\Mcp\Exceptions\ToolArgumentInvalid;
use App\Mcp\Support\ToolArguments;
use App\Support\AssigneeIdentity;
use App\Support\AssignmentReference;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\ObjectType;

/**
 * Reads the recipient and expected assignment common to assignment changes.
 */
trait ReadsAssignmentArguments
{
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

    private function assignee(ToolArguments $arguments): AssigneeIdentity
    {
        $type = $arguments->enum('type', ActorType::class);

        if (! in_array($type, ActorType::requestTypes(), true)) {
            throw ToolArgumentInvalid::for('type', 'an agent or user');
        }

        return new AssigneeIdentity($type->value, $arguments->ulid('id'));
    }
}
