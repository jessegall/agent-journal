<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Models\Runs\ProcessRun;
use App\Support\Execution\SpawnedProcess;
use Tests\Fixtures\Processes\CollectedOutput;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Pipeline stages run at the same time with their own output and ends, background parts outlive the foreground step,
 * and a stop reaches the whole process group.
 */
final class PipelineAndStopTest extends TestCase
{
    private CollectedOutput $output;

    private ProcessRun $processRun;

    private string $folder;

    protected function setUp(): void
    {
        parent::setUp();

        $this->output = new CollectedOutput();
        $this->folder = sys_get_temp_dir().'/pipeline-'.bin2hex(random_bytes(4));
        mkdir($this->folder);
    }

    #[TimeLimit(10, 'The child ignores SIGTERM, so the stop waits its five-second grace before forcing it.')]
    public function test_a_child_that_ignores_sigterm_is_forced_after_the_grace_period(): void
    {
        $process = SpawnedProcess::start(
            ['sh', '-c', 'trap "" TERM; sleep 30'],
            [1 => ['pipe', 'w'], 2 => ['pipe', 'w']],
            $this->folder,
            ['PATH' => (string) getenv('PATH')],
        );
        $this->assertInstanceOf(SpawnedProcess::class, $process);
        usleep(200_000);

        $this->assertTrue($process->stopGroup(5.0));
    }
}
