<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Actors\Support\ActorIdentity;
use App\Processes\Contracts\CommandClassifier;
use App\Processes\Contracts\ShellSyntax;
use App\Processes\Enums\LifecycleState;
use App\Processes\Enums\PartEndType;
use App\Processes\Enums\ShellDialect;
use App\Processes\Execution\RecordedRunEvents;
use App\Processes\Execution\SpawnedProcess;
use App\Processes\Execution\StepOutcome;
use App\Processes\Execution\Supervisor;
use App\Processes\Models\PartRun;
use App\Processes\Models\ProcessRun;
use App\Processes\Support\ExecutionPlanner;
use App\Processes\Values\ExecutionContext;
use Tests\Fixtures\Processes\CollectedOutput;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestRunAdmissions;
use Tests\TestCase;

/**
 * The supervisor runs control flow, builtins and argv spawns, each part with its own record and its own end (doc 21
 * revision 6, section 53; stories 106-118, 169, 170, 173 and 204).
 */
final class SupervisorTest extends TestCase
{
    use RefreshHookDatabase;

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

    public function test_a_failed_and_skips_its_right_side_and_the_or_side_recovers(): void
    {
        $this->supervise('false && printf skipped || printf recovered');

        [$false, $skipped, $recovered] = $this->parts();
        $this->assertSame(1, $false->end()->code);
        $this->assertSame(LifecycleState::Skipped, $skipped->lifecycle);
        $this->assertSame(LifecycleState::Ended, $recovered->lifecycle);
        $this->assertSame('recovered', $this->output->stdoutOf($recovered));
    }

    public function test_a_sequence_runs_its_second_step_after_a_failure(): void
    {
        $outcome = $this->supervise('false; echo after');

        $this->assertSame(0, $outcome->status);
        $this->assertSame("after\n", $this->output->stdoutOf($this->parts()[1]));
    }

    public function test_negation_flips_the_branch_but_keeps_the_childs_exit(): void
    {
        $outcome = $this->supervise('! false');

        $this->assertSame(0, $outcome->status);
        $this->assertSame(1, $this->parts()[0]->end()->code);
    }

    public function test_cd_reaches_pwd_and_both_are_recorded(): void
    {
        $this->supervise('cd project && pwd');

        [$cd, $pwd] = $this->parts();
        $this->assertSame(LifecycleState::Ended, $cd->lifecycle);
        $this->assertSame(realpath($this->folder.'/project')."\n", $this->output->stdoutOf($pwd));
    }

    public function test_a_quoted_semicolon_is_one_part_and_printed_completion_json_is_only_output(): void
    {
        $outcome = $this->supervise("printf '%s' 'a; b' && printf '{\"status\":\"complete\"}'");

        $this->assertCount(2, $this->parts());
        $this->assertSame('a; b{"status":"complete"}', $outcome->output);
        $this->assertSame(LifecycleState::Queued, $this->processRun->refresh()->lifecycle);
    }

    public function test_an_external_part_is_spawned_from_its_argv_with_its_own_record(): void
    {
        touch($this->folder.'/project/notes.txt');

        $this->supervise('ls project');

        $ls = $this->parts()[0];
        $this->assertNotNull($ls->pid);
        $this->assertSame("notes.txt\n", $this->output->stdoutOf($ls));
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

    private function supervise(string $line): StepOutcome
    {
        $context = new ExecutionContext(
            ShellDialect::Bash,
            $this->folder,
            $this->folder,
            ['PATH' => (string) getenv('PATH')],
        );
        $tree = $this->app->make(ShellSyntax::class)->parse($line, ShellDialect::Bash);
        $plan = $this->app->make(ExecutionPlanner::class)->plan(
            $tree,
            $this->app->make(CommandClassifier::class)->classify($tree, $context),
        );
        $this->processRun = ProcessRun::admit(ActorIdentity::system(), TestRunAdmissions::of(line: $line, plan: $plan));

        return $this->app->make(Supervisor::class)->run(
            new RecordedRunEvents($this->processRun, $this->output),
            $plan,
            $context,
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
