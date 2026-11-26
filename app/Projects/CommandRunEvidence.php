<?php

declare(strict_types=1);

namespace App\Projects;

/**
 * What this server can prove about a journal verb's run: which worker runs it, whether that worker still lives and
 * whether a recorded process still runs. A worker of another server cannot be asked, so it counts as alive.
 */
final readonly class CommandRunEvidence
{
    /**
     * The worker that runs a verb from this process: this server's name and the process id.
     */
    public function currentWorker(): string
    {
        return gethostname().':'.getmypid();
    }

    public function isWorkerAlive(string $worker): bool
    {
        [$server, $pid] = array_pad(explode(':', $worker, 2), 2, '');

        if ($server !== gethostname()) {
            return true;
        }

        return $this->isProcessAlive((int) $pid);
    }

    public function isProcessAlive(int $pid): bool
    {
        return $pid > 0 && posix_kill($pid, 0);
    }
}
