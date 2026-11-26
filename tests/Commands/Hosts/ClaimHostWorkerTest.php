<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Commands\Hosts\ClaimHostWorker\ClaimHostWorkerCommand;
use App\Models\Hosts\HostProcess;
use Carbon\CarbonImmutable;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A worker claims a process by taking its next generation, which deposes the worker before it, and holds the lease
 * for its length from now.
 */
#[TestsCommand(ClaimHostWorkerCommand::class)]
final class ClaimHostWorkerTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_each_claim_takes_the_next_generation_and_holds_the_lease(): void
    {
        $now = CarbonImmutable::parse('2026-11-26 10:00:00');
        $this->journal->useServerClockAt($now)->enrollHost('Mac', [base_path()])->openHostProcess('Mac', 'shell');
        $id = $this->journal->hostProcessCalled('shell')->id;

        $first = $this->journal->asSystem(new ClaimHostWorkerCommand($id));
        $second = $this->journal->asSystem(new ClaimHostWorkerCommand($id));
        $process = $this->journal->hostProcessCalled('shell');

        $this->journal->assertResult(
            [1, 2, 2, $now->addSeconds(HostProcess::WORKER_LEASE_SECONDS)->toIso8601String()],
            [$first, $second, $process->worker_generation, $process->worker_until?->toIso8601String()],
        );
    }
}
