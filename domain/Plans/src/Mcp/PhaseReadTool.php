<?php

declare(strict_types=1);

namespace Domain\Plans\Mcp;

use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Contracts\Continuations;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\Continuation;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalReadTool;
use Domain\Plans\Contracts\PlanDetailsResolver;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[IsReadOnly]
#[Name('phases_read')]
#[VisibleToProfiles(DiscoveryProfile::MainAgent)]
#[Description('Read a phase and its ordered task references.')]
final class PhaseReadTool extends JournalReadTool
{
    public function __construct(
        private readonly PlanDetailsResolver $plans,
        private readonly Continuations $continuations,
    ) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            'phase_id' => $schema->string()->max(26)->required(),
            'continuation' => $schema->string(),
        ];
    }

    protected function read(ToolArguments $arguments): ToolResult
    {
        $phase = $this->plans->phase($arguments->ulid('phase_id'));
        $cursor = $arguments->continuation();
        $offset = $cursor === null ? 0 : $this->offset($cursor, $phase->id, $phase->revision);
        $next = $offset + PlanDetailsResolver::TASKS_PER_READ;
        $position = new Continuation($this->name(), $phase->id, [], $next, revision: $phase->revision);

        return ToolResult::ok([
            'phase_id' => $phase->id,
            'plan_id' => $phase->planId,
            'number' => $phase->number,
            'title' => $phase->title,
            'revision' => $phase->revision,
            'task_ids' => array_slice($phase->taskIds, $offset, PlanDetailsResolver::TASKS_PER_READ),
        ], $next < count($phase->taskIds) ? [$this->continuations->link($position, 'phase_id')] : []);
    }

    private function offset(string $cursor, string $phaseId, int $revision): int
    {
        $position = $this->continuations->open($cursor, $this->name(), $phaseId);
        $position->assertCurrentRevision($revision);

        return $position->offset;
    }
}
