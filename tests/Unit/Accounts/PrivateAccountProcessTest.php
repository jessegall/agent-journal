<?php

declare(strict_types=1);

namespace Tests\Unit\Accounts;

use App\Support\PrivateAccountProcess;
use PHPUnit\Framework\TestCase;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * A status check ends within its time limit with no exit code, and a check that prints far more than the buffer
 * neither stalls on a full pipe nor keeps more than the buffer's last bytes.
 */
final class PrivateAccountProcessTest extends TestCase
{
    #[TimeLimit(seconds: 5, reason: 'The check sleeps past its one-second limit on purpose.')]
    public function test_a_check_past_its_time_limit_is_stopped_with_no_exit_code(): void
    {
        $process = PrivateAccountProcess::start(['sh', '-c', 'sleep 10'], [], sys_get_temp_dir());

        $process->finish(1);

        $this->assertNull($process->exitCode());
        $this->assertFalse($process->isRunning());
    }

    public function test_a_check_that_prints_far_more_than_the_buffer_ends_and_keeps_only_its_last_bytes(): void
    {
        $script = 'head -c 300000 /dev/zero | tr "\\0" a; printf end';
        $process = PrivateAccountProcess::start(['sh', '-c', $script], [], sys_get_temp_dir());

        $output = $process->finish();

        $this->assertSame(65536, strlen($output));
        $this->assertStringEndsWith('end', $output);
        $this->assertSame(0, $process->exitCode());
    }
}
