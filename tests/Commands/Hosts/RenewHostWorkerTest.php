<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Commands\Hosts\ClaimHostWorker\ClaimHostWorkerCommand;
use App\Commands\Hosts\RenewHostWorker\RenewHostWorkerCommand;
use App\Exceptions\WorkerFenced;
use App\Models\Hosts\HostProcess;
use Carbon\CarbonImmutable;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The worker that holds a process renews its lease from now; a worker another has deposed is fenced.
 */
#[TestsCommand(RenewHostWorkerCommand::class)]
final class RenewHostWorkerTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_the_current_worker_renews_its_lease_and_a_deposed_one_is_fenced(): void
    {
        $claimed = CarbonImmutable::parse('2026-11-26 10:00:00');
        $this->journal->useServerClockAt($claimed)->enrollHost('Mac', [base_path()])->openHostProcess('Mac', 'shell');
        $id = $this->journal->hostProcessCalled('shell')->id;
        $generation = $this->journal->asSystem(new ClaimHostWorkerCommand($id));

        $renewed = $claimed->addSeconds(30);
        $this->journal->useServerClockAt($renewed)->asSystem(new RenewHostWorkerCommand($id, $generation));

        $this->journal
            ->assertRefused(
                WorkerFenced::class,
                fn () => $this->journal->asSystem(new RenewHostWorkerCommand($id, $generation - 1)),
            )
            ->assertResult(
                $renewed->addSeconds(HostProcess::WORKER_LEASE_SECONDS)->toIso8601String(),
                $this->journal->hostProcessCalled('shell')->worker_until?->toIso8601String(),
            );
    }
}
