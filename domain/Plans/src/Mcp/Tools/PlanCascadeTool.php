<?php

declare(strict_types=1);

namespace Domain\Plans\Mcp\Tools;

use App\Contracts\Bus\RequestKey;
use App\Enums\Assignments\AssignmentOutcomeType;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\NextAction;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Exceptions\ToolArgumentInvalid;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\Concerns\ReadsAssignmentArguments;
use App\Mcp\Tools\JournalWriteTool;
use App\Support\AssignmentResult;
use App\Support\RecordIdentity;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\ObjectType;

/**
 * Summarizes a plan or phase cascade and links to its complete receipted outcomes.
 */
#[VisibleToProfiles(DiscoveryProfile::MainAgent)]
abstract class PlanCascadeTool extends JournalWriteTool
{
    use ReadsAssignmentArguments;

    private const array ROOT_TYPES = [
        'plans.plan',
        'plans.phase',
    ];

    /**
     * Takes the request key the cascade's commands run under.
     */
    public function __construct(private readonly RequestKey $key) {}

    /**
     * The schema of the root argument: a plan or a phase, by type and id.
     */
    final protected function rootSchema(JsonSchema $schema): ObjectType
    {
        return $schema->object([
            'type' => $schema->string()->enum(self::ROOT_TYPES)->required(),
            'id' => $this->recordIdArgument($schema),
        ])->withoutAdditionalProperties()->required();
    }

    /**
     * The plan or phase the root argument names, whose tasks the tool changes.
     */
    final protected function root(ToolArguments $arguments): RecordIdentity
    {
        $root = $arguments->object('root', [
            'type',
            'id',
        ]);
        $type = $root->text('type');

        if (! in_array($type, self::ROOT_TYPES, true)) {
            throw ToolArgumentInvalid::for('root.type', 'plans.plan or plans.phase');
        }

        return new RecordIdentity($type, $root->ulid('id'));
    }

    /**
     * @param  AssignmentResult  $assignmentResult
     */
    final protected function present(mixed $assignmentResult): ToolResult
    {
        return ToolResult::ok([
            'changed' => $assignmentResult->count(AssignmentOutcomeType::Changed),
            'unchanged' => $assignmentResult->count(AssignmentOutcomeType::Unchanged),
            'skipped_finished' => $assignmentResult->count(AssignmentOutcomeType::SkippedFinished),
        ], [
            new NextAction('operations_read', ['request_key' => $this->key->requireFor(static::class)]),
        ]);
    }
}
