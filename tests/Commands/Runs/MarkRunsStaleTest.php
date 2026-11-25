<?php

declare(strict_types=1);

namespace Tests\Commands\Runs;

use App\Commands\Runs\MarkRunsStale\MarkRunsStaleCommand;
use App\Contracts\Bus\CommandBus;
use App\Values\PartKey;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Every unfinished run of a project, and none of another project, is marked stale with the reason and counted.
 */
#[TestsCommand(MarkRunsStaleCommand::class)]
final class MarkRunsStaleTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_only_the_unfinished_runs_of_the_project_go_stale_and_are_counted(): void
    {
        $this->journal->owner()->project('Shop')->agent('Runner')->agent('Shopper', 'main-agent', 'Shop')
            ->actAs('Shopper')
            ->processRun('Elsewhere', 'cat composer.json')
            ->runningPart('Elsewhere', new PartKey(1, 1, 'cat'));
        $run = $this->journal->actAs('Runner')
            ->processRun('Read', 'cat composer.json')
            ->runningPart('Read', new PartKey(1, 1, 'cat'))
            ->processRunCalled('Read');

        $count = $this->app->make(CommandBus::class)->run(new MarkRunsStaleCommand($run->project_id, 'the rules changed'));

        $this->assertSame(1, $count);
        $this->assertSame([true, 'the rules changed'], [$run->refresh()->isStale(), $run->stale_reason]);
    }
}
