<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Contracts\Bus\CommandClassifier;
use App\Enums\CommandRules\CommandClass;
use App\Enums\Processes\ShellDialect;
use App\Enums\Runs\LifecycleStatus;
use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessRun;
use App\Pipelines\SuperviseRunPipeline;
use App\Support\ActorIdentity;
use App\Support\Execution\PlannedRun;
use App\Support\Execution\RecordedRunEvents;
use App\Support\Execution\StepOutcome;
use App\Support\ExecutionPlanner;
use App\Support\PipelineRunner;
use App\Support\Syntax\TreeParser;
use App\Values\ArgumentGrammar;
use App\Values\CommandClassSet;
use App\Values\CommandRule;
use App\Values\ExecutionContext;
use App\Values\ProgramSpellings;
use App\Values\RuleScope;
use Tests\Fixtures\Processes\CollectedOutput;
use Tests\Fixtures\Processes\StaleAfterFirstEnd;
use Tests\Support\ActsAsActors;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestRunAdmissions;
use Tests\TestCase;

/**
 * A change to the project's active rules leaves no unfinished run resting on the old ones: a queued admission is
 * refused on start, and a running run starts no further part while its started parts keep their records.
 */
final class StaleAdmissionTest extends TestCase
{
    use ActsAsActors;
    use RefreshHookDatabase;

    private const string EXPLAIN_AGAIN = 'explain the line again';

    private const string RETIRED_PRINTF = 'printf was retired';

    public function test_a_run_whose_rules_changed_mid_run_skips_its_later_part_and_keeps_the_earlier_one(): void
    {
        $folder = sys_get_temp_dir();
        $line = 'printf first; printf second';
        $context = new ExecutionContext(ShellDialect::Bash, $folder, $folder, ['PATH' => (string) getenv('PATH')]);
        $tree = $this->app->make(TreeParser::class)->parse($line, ShellDialect::Bash);
        $classification = $this->app->make(CommandClassifier::class)->classify($tree, $context);
        $plan = $this->app->make(ExecutionPlanner::class)->plan($tree, $classification);
        $run = $this->admit(ActorIdentity::system(), $line);
        $events = new StaleAfterFirstEnd(
            new RecordedRunEvents($run, new CollectedOutput()),
            $run,
            'rule-revision-changed: printf was retired',
        );

        $this->app->make(PipelineRunner::class)->run(
            SuperviseRunPipeline::class,
            new PlannedRun($events, $plan, $context),
            StepOutcome::class,
        );

        $parts = PartRun::query()->where('process_run_id', $run->id)->orderBy('syntax_node')->get();
        $this->assertSame(LifecycleStatus::Ended, $parts[0]->lifecycle);
        $this->assertSame(LifecycleStatus::Skipped, $parts[1]->lifecycle);
        $this->assertStringContainsString(self::RETIRED_PRINTF, $parts[1]->skip_reason);
    }

    private function admit(ActorIdentity $actor, string $line): ProcessRun
    {
        return ProcessRun::create(
            $actor,
            TestRunAdmissions::of(projectKey: (string) config('processes.project_key'), line: $line),
        );
    }

    private function tidyRule(): CommandRule
    {
        return CommandRule::forProgram(
            'project.tidy.list',
            new ProgramSpellings('tidy'),
            ['list'],
            ArgumentGrammar::none(),
            CommandClassSet::of(CommandClass::Read),
        )->ownedBy(RuleScope::project(), 1);
    }
}
