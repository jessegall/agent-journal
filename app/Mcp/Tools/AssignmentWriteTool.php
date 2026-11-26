<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Actors\Contracts\ActorTypes;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\Concerns\ReadsAssignmentArguments;
use App\Support\AssignmentResult;
use App\Support\RecordIdentity;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;

/**
 * Maps single-record assignment arguments and outcomes for MCP.
 */
#[VisibleToProfiles(DiscoveryProfile::MainAgent)]
abstract class AssignmentWriteTool extends JournalWriteTool
{
    use ReadsAssignmentArguments;

    /**
     * Takes the registered actor types, which the arguments are read against.
     */
    public function __construct(protected readonly ActorTypes $actorTypes) {}

    /**
     * @return array<string, Type>
     */
    final protected function recordSchema(JsonSchema $schema): array
    {
        return [
            'record_type' => $schema->string()->max(100)->required(),
            'record_id' => $this->recordIdArgument($schema),
        ];
    }

    /**
     * The record the tool's record type and id name.
     */
    final protected function record(ToolArguments $arguments): RecordIdentity
    {
        return new RecordIdentity($arguments->text('record_type'), $arguments->ulid('record_id'));
    }

    /**
     * @param  AssignmentResult  $change
     */
    final protected function present(mixed $change): ToolResult
    {
        $outcome = $change->outcomes[0];

        return ToolResult::ok([
            'outcome' => $outcome->type->value,
            'changed' => count($change->changes),
            'assignment' => $outcome->current?->reference->toArray(),
        ]);
    }
}
