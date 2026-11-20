<?php

declare(strict_types=1);

namespace Domain\Plans\Mcp;

use App\Assignments\Enums\AssignmentOutcomeType;
use App\Mcp\Tools\Concerns\ReadsAssignmentArguments;
use App\Assignments\Support\AssignmentResult;
use App\Bus\Contracts\RequestKey;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\NextAction;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Exceptions\ToolArgumentInvalid;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use App\Records\Support\RecordIdentity;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\ObjectType;

/** Summarizes a plan or phase cascade and links to its complete receipted outcomes. */
#[VisibleToProfiles(DiscoveryProfile::MainAgent)]
abstract class PlanCascadeTool extends JournalWriteTool
{
    use ReadsAssignmentArguments;

    private const array ROOT_TYPES = ['plans.plan', 'plans.phase'];

    public function __construct(private readonly RequestKey $key) {}

    final protected function rootSchema(JsonSchema $schema): ObjectType
    {
        return $schema->object([
            'type' => $schema->string()->enum(self::ROOT_TYPES)->required(),
            'id' => $schema->string()->max(26)->required(),
        ])->withoutAdditionalProperties()->required();
    }

    final protected function root(ToolArguments $arguments): RecordIdentity
    {
        $root = $arguments->object('root', ['type', 'id']);
        $type = $root->text('type');

        if (! in_array($type, self::ROOT_TYPES, true)) {
            throw ToolArgumentInvalid::for('root.type', 'plans.plan or plans.phase');
        }

        return new RecordIdentity($type, $root->ulid('id'));
    }

    /** @param AssignmentResult $result */
    final protected function present(mixed $result): ToolResult
    {
        return ToolResult::ok([
            'changed' => $result->count(AssignmentOutcomeType::Changed),
            'unchanged' => $result->count(AssignmentOutcomeType::Unchanged),
            'skipped_finished' => $result->count(AssignmentOutcomeType::SkippedFinished),
        ], [
            new NextAction('operations_read', ['request_key' => $this->key->requireFor(static::class)]),
        ]);
    }
}
