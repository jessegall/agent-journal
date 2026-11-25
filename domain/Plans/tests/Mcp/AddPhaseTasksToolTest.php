<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Mcp;

use Domain\Plans\Commands\AddPhaseTasks\AddPhaseTasksCommand;
use Domain\Plans\Mcp\Tools\AddPhaseTasksTool;
use Domain\Plans\PlansDomain;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent places tasks in a phase at the revision it read.
 */
#[TestsMcpTool(AddPhaseTasksTool::class)]
final class AddPhaseTasksToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Planner');
        $phase = $journal->fixtures(PlanFixtures::class)->plan('Release')->phase('Release', 'Design')->phaseCalled('Design');
        $task = $journal->fixtures(TaskFixtures::class)->createTask('Ship the dock');

        return ToolCall::by($start)
            ->arguments([
                'phase_id' => $phase->id,
                'task_ids' => [$task->id],
                'expected_revision' => 1,
                'request_key' => 'plans-1',
            ])
            ->expects(AddPhaseTasksCommand::class, [
                'phaseId' => $phase->id,
                'taskIds' => [$task->id],
            ]);
    }
}
