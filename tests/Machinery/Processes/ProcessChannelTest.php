<?php

declare(strict_types=1);

namespace Tests\Machinery\Processes;

use App\Contracts\Bus\CommandClassifier;
use App\Enums\Processes\ShellDialect;
use App\Enums\Runs\LifecycleStatus;
use App\Models\Agents\Agent;
use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessEvent;
use App\Models\Runs\ProcessRun;
use App\Support\ActorReference;
use App\Support\ExecutionPlanner;
use App\Support\Syntax\TreeParser;
use App\Values\ExecutionContext;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\Processes\ProcessOutputDisk;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestRunAdmissions;
use Tests\TestCase;

/**
 * process:run fetches its admission once and reports every part over the signed event channel; repeats change
 * nothing and a lost connection is made up from the host's spool.
 */
final class ProcessChannelTest extends TestCase
{
    use RefreshHookDatabase;

    private TestStart $start;

    private string $folder;

    protected function setUp(): void
    {
        parent::setUp();

        ProcessOutputDisk::fake();
        config(['processes.runner' => true]);
        $this->start = $this->journal->signedStart('Main agent', 'main-agent');
        $this->journal->relayAgentCommands($this->start);
        $this->folder = sys_get_temp_dir().'/channel-'.bin2hex(random_bytes(4));
        mkdir($this->folder);
    }

    public function test_process_run_records_every_part_and_a_second_start_runs_nothing(): void
    {
        $run = $this->admit("printf '{\"part\":\"ended\"}' && echo done");

        $this->artisan('process:run', ['--admission' => $run->id])->expectsOutputToContain('done')->assertExitCode(0);
        $this->artisan(
            'process:run',
            ['--admission' => $run->id],
        )->expectsOutputToContain('already started')->assertExitCode(0);

        $parts = PartRun::query()->where('process_run_id', $run->id)->orderBy('syntax_node')->get();
        $this->assertCount(2, $parts);
        $this->assertSame(
            [LifecycleStatus::Ended, LifecycleStatus::Ended],
            $parts->map(fn (PartRun $part) => $part->lifecycle)->all(),
        );
        $this->assertSame(
            0,
            ProcessEvent::query()->where('process_run_id', $run->id)->where(
                'type',
                ProcessEvent::OPERATIONAL_ERROR,
            )->count(),
        );
    }

    private function admit(string $line): ProcessRun
    {
        $context = new ExecutionContext(ShellDialect::Bash, $this->folder, $this->folder);
        $tree = $this->app->make(TreeParser::class)->parse($line, ShellDialect::Bash);
        $plan = $this->app->make(ExecutionPlanner::class)->plan(
            $tree,
            $this->app->make(CommandClassifier::class)->classify($tree, $context),
        );

        return ProcessRun::create(
            ActorReference::ofClass(Agent::class, $this->start->agent->id),
            TestRunAdmissions::of(line: $line, plan: $plan, workingFolder: $this->folder),
        );
    }
}
