<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use App\Contracts\Processes\RunClaims;
use Domain\Plans\Models\Plan;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Resolvers\Support\TaskRecords;
use Domain\Tasks\Support\States\WorkingOnTaskState;
use Tests\TestCase;

/**
 * A task or plan frame names its work record and answers its own instruction, read fresh each time it is asked.
 */
final class ForegroundInstructionsTest extends TestCase
{
    public function test_a_task_frame_names_its_task_and_run(): void
    {
        $state = new WorkingOnTaskState('task-12', 12, 3, new TaskRecords(), $this->createStub(RunClaims::class));

        $this->assertSame(Task::LINK_TYPE, $state->workRecordType()->get());
        $this->assertStringContainsString('12', $state->instruction()->get()->text);
        $this->assertStringContainsString('3', $state->instruction()->get()->text);
    }
}
