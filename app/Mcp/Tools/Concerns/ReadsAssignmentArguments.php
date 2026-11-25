<?php

declare(strict_types=1);

namespace App\Mcp\Tools\Concerns;

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
    /**
     * The schema of an assignee argument: its actor type and id.
     */
    final protected function assigneeSchema(JsonSchema $schema): ObjectType
    {
        return $schema->object([
            'type' => $schema->string()->enum($this->actorTypes->requestTypes())->required(),
            'id' => $this->recordIdArgument($schema),
        ])->withoutAdditionalProperties()->required();
    }

    /**
     * The schema of the expected assignment argument: its id and holder.
     */
    final protected function expectedSchema(JsonSchema $schema): ObjectType
    {
        return $schema->object([
            'id' => $this->recordIdArgument($schema),
            'holder' => $this->assigneeSchema($schema),
        ])->withoutAdditionalProperties()->required();
    }

    /**
     * The assignee the recipient argument names.
     */
    final protected function recipient(ToolArguments $arguments): AssigneeIdentity
    {
        return $this->assignee($arguments->object('recipient', [
            'type',
            'id',
        ]));
    }

    /**
     * The assignment the expected assignment argument names, which the record must still hold.
     */
    final protected function expected(ToolArguments $arguments): AssignmentReference
    {
        $expected = $arguments->object('expected_assignment', [
            'id',
            'holder',
        ]);

        return new AssignmentReference(
            $expected->ulid('id'),
            $this->assignee($expected->object('holder', [
                'type',
                'id',
            ])),
        );
    }

    private function assignee(ToolArguments $arguments): AssigneeIdentity
    {
        $type = $arguments->oneOf('type', $this->actorTypes->requestTypes());

        return new AssigneeIdentity($type, $arguments->ulid('id'));
    }
}
