<?php

declare(strict_types=1);

namespace Tests\Commands\Runs;

use App\Commands\Runs\MarkRunsStale\MarkRunsStaleCommand;
use App\Contracts\Bus\CommandBus;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Runs\AdmitsShellRuns;
use Tests\TestCase;

/**
 * Every unfinished run of a project is marked stale with the reason and counted.
 */
final class MarkRunsStaleTest extends TestCase
{
    use AdmitsShellRuns;
    use RefreshHookDatabase;

    public function test_the_unfinished_runs_of_the_project_go_stale_and_are_counted(): void
    {
        $run = $this->runningRun();

        $count = $this->app->make(CommandBus::class)->run(new MarkRunsStaleCommand($run->project_key, 'the rules changed'));

        $this->assertSame(1, $count);
        $this->assertSame([true, 'the rules changed'], [$run->refresh()->isStale(), $run->stale_reason]);
    }
}
