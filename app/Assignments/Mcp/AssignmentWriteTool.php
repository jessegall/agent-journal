<?php

declare(strict_types=1);

namespace App\Assignments\Mcp;

use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Enums\DiscoveryProfile;
use App\Assignments\Mcp\Concerns\ReadsAssignmentArguments;
use App\Assignments\Support\AssignmentResult;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use App\Records\Support\RecordIdentity;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;

/** Maps single-record assignment arguments and outcomes for MCP. */
#[VisibleToProfiles(DiscoveryProfile::MainAgent)]
abstract class AssignmentWriteTool extends JournalWriteTool
{
    use ReadsAssignmentArguments;

    /** @return array<string, Type> */
    final protected function recordSchema(JsonSchema $schema): array
    {
        return [
            'record_type' => $schema->string()->max(100)->required(),
            'record_id' => $schema->string()->max(26)->required(),
        ];
    }

    final protected function record(ToolArguments $arguments): RecordIdentity
    {
        return new RecordIdentity($arguments->text('record_type'), $arguments->ulid('record_id'));
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
}
