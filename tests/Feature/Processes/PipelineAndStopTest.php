<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Contracts\Bus\CommandClassifier;
use App\Contracts\Processes\StopSignal;
use App\Enums\LifecycleState;
use App\Enums\PartEndType;
use App\Enums\ShellDialect;
use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessRun;
use App\Support\ActorIdentity;
use App\Support\Execution\NoStop;
use App\Support\Execution\RecordedRunEvents;
use App\Support\Execution\SpawnedProcess;
use App\Support\Execution\StepOutcome;
use App\Support\Execution\Supervisor;
use App\Support\ExecutionPlanner;
use App\Support\Syntax\TreeParser;
use App\Values\ExecutionContext;
use Tests\Fixtures\Processes\CollectedOutput;
use Tests\Fixtures\Processes\StopAfter;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestRunAdmissions;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Pipeline stages run at the same time with their own output and ends, background parts outlive the foreground step,
 * and a stop reaches the whole process group (doc 21 revision 6, section 53).
 */
final class PipelineAndStopTest extends TestCase
{
    use RefreshHookDatabase;

    private const string INPUT_LINES = <<<'TEXT'
        x one
        y two
        x three

        TEXT;

    private const string MATCHING_LINES = <<<'TEXT'
        x one
        x three

        TEXT;

    private const string STOP_REASON = 'the user stopped it';

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

    public function test_each_pipeline_stage_keeps_its_own_output_and_end(): void
    {
        file_put_contents($this->folder.'/input.txt', self::INPUT_LINES);

        $outcome = $this->supervise('cat input.txt | grep x');

        [$cat, $grep] = $this->parts();
        $this->assertSame(self::INPUT_LINES, $this->output->stdoutOf($cat));
        $this->assertSame(self::MATCHING_LINES, $this->output->stdoutOf($grep));
        $this->assertSame(PartEndType::Exited, $cat->end()->type);
        $this->assertSame(0, $outcome->status);
    }

    #[TimeLimit(10, 'It pipes a 20 MiB file into head, which closes early.')]
    public function test_head_on_a_long_producer_ends_it_by_sigpipe(): void
    {
        file_put_contents($this->folder.'/big.txt', str_repeat(str_repeat('a', 1023)."\n", 20_480));

        $this->supervise('cat big.txt | head -1');

        [$cat, $head] = $this->parts();
        $this->assertSame(PartEndType::Signalled, $cat->end()->type);
        $this->assertSame(SIGPIPE, $cat->end()->code);
        $this->assertSame(0, $head->end()->code);
    }

    #[TimeLimit(5, 'A background sleep of one second runs while the foreground step returns.')]
    public function test_a_background_part_runs_on_while_the_foreground_step_returns(): void
    {
        $this->supervise('sleep 1 & echo done');

        [$sleep, $echo] = $this->parts();
        $this->assertSame(LifecycleState::Ended, $sleep->lifecycle);
        $this->assertTrue($echo->ended_at->lessThan($sleep->ended_at));
    }

    #[TimeLimit(5, 'It waits a fraction of a second before the stop.')]
    public function test_a_stop_ends_the_part_and_records_why(): void
    {
        $this->supervise('sleep 30', new StopAfter(0.3, self::STOP_REASON));

        $sleep = $this->parts()[0];
        $this->assertSame(LifecycleState::Stopped, $sleep->lifecycle);
        $this->assertSame(self::STOP_REASON, $sleep->stop_reason);
        $this->assertSame(LifecycleState::Stopped, $this->processRun->refresh()->lifecycle);
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

    private function supervise(string $line, StopSignal $stop = new NoStop()): StepOutcome
    {
        $context = new ExecutionContext(
            ShellDialect::Bash,
            $this->folder,
            $this->folder,
            ['PATH' => (string) getenv('PATH')],
        );
        $tree = $this->app->make(TreeParser::class)->parse($line, ShellDialect::Bash);
        $plan = $this->app->make(ExecutionPlanner::class)->plan(
            $tree,
            $this->app->make(CommandClassifier::class)->classify($tree, $context),
        );
        $this->processRun = ProcessRun::create(
            ActorIdentity::system(),
            TestRunAdmissions::of(line: $line, plan: $plan),
        );

        return $this->app->make(Supervisor::class)->run(
            new RecordedRunEvents($this->processRun, $this->output),
            $plan,
            $context,
            $stop,
        );
    }

    /**
     * @return list<PartRun>
     */
    private function parts(): array
    {
        return array_values($this->processRun->parts()->orderBy('created_at')->orderBy('id')->get()->all());
    }
}
