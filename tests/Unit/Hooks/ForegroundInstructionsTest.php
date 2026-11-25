<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use Domain\Plans\Models\Plan;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Support\States\WorkOnTaskState;
use Tests\Support\TestText;
use Tests\TestCase;

/**
 * A task or plan frame names its work record and answers its own instruction, read fresh each time it is asked.
 */
final class ForegroundInstructionsTest extends TestCase
{
    public function test_a_task_frame_names_its_task_and_run(): void
    {
        $state = new WorkOnTaskState('task-12', 12, 3);

        $this->assertSame(Task::linkType(), $state->workRecordType()->get());
        $this->assertStringContainsString('12', TestText::words($state->instruction()->get()));
        $this->assertStringContainsString('3', TestText::words($state->instruction()->get()));
    }
}
