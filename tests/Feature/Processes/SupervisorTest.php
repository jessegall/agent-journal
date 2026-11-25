<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Enums\Runs\PartEndType;
use App\Models\Runs\ProcessRun;
use App\Support\Execution\SpawnedProcess;
use Tests\Fixtures\Processes\CollectedOutput;
use Tests\TestCase;

/**
 * The supervisor runs control flow, builtins and argv spawns, each part with its own record and its own end.
 */
final class SupervisorTest extends TestCase
{
    private CollectedOutput $output;

    private ProcessRun $processRun;

    private string $folder;

    protected function setUp(): void
    {
        parent::setUp();

        $this->output = new CollectedOutput();
        $this->folder = sys_get_temp_dir().'/supervisor-'.bin2hex(random_bytes(4));
        mkdir($this->folder.'/project', recursive: true);
    }

    public function test_a_killed_child_is_signalled_with_no_status_code(): void
    {
        $process = SpawnedProcess::start(
            ['sleep', '5'],
            [1 => ['pipe', 'w'], 2 => ['pipe', 'w']],
            $this->folder,
            ['PATH' => (string) getenv('PATH')],
        );
        $this->assertInstanceOf(SpawnedProcess::class, $process);

        $process->kill(9);

        $end = $process->wait();
        $this->assertSame(PartEndType::Signalled, $end->type);
        $this->assertFalse($end->hasStatus());
    }
}
