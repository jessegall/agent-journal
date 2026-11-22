<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Commands\RetireCommandRule\RetireCommandRuleCommand;
use App\Commands\SaveCommandRule\SaveCommandRuleCommand;
use App\Contracts\Bus\CommandClassifier;
use App\Enums\ActorType;
use App\Enums\CommandClass;
use App\Enums\LifecycleState;
use App\Enums\ShellDialect;
use App\Models\ClassificationRule;
use App\Models\PartRun;
use App\Models\ProcessRun;
use App\Support\ActorIdentity;
use App\Support\Execution\RecordedRunEvents;
use App\Support\Execution\Supervisor;
use App\Support\ExecutionPlanner;
use App\Support\Syntax\TreeParser;
use App\Values\ArgumentGrammar;
use App\Values\CommandClassSet;
use App\Values\CommandRule;
use App\Values\ExecutionContext;
use App\Values\ProgramSpellings;
use App\Values\RuleScope;
use Tests\Fixtures\Agents\TestStart;
use Tests\Fixtures\Processes\AcmeDeclarations;
use Tests\Fixtures\Processes\CollectedOutput;
use Tests\Fixtures\Processes\StaleAfterFirstEnd;
use Tests\Support\ActsAsActors;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\SendsSignedCalls;
use Tests\Support\TestRunAdmissions;
use Tests\TestCase;

/**
 * A change to the project's active rules leaves no unfinished run resting on the old ones: a queued admission is
 * refused on start, and a running run starts no further part while its started parts keep their records (doc 21
 * revision 6, sections 51, 68 and 71; stories 65, 85, 92, 93, 146 and 190).
 */
final class StaleAdmissionTest extends TestCase
{
    use ActsAsActors;
    use RefreshHookDatabase;
    use SendsSignedCalls;

    private const string EXPLAIN_AGAIN = 'explain the line again';

    private const string RETIRED_PRINTF = 'printf was retired';

    public function test_retiring_a_rule_makes_a_queued_admission_refuse_on_start(): void
    {
        config(['processes.runner' => true]);
        $start = TestStart::start();
        $queued = $this->admit(new ActorIdentity(ActorType::Agent, $start->agent->id), 'printf queued');
        $this->asUser(new SaveCommandRuleCommand('save-1', AcmeDeclarations::proposed($this->tidyRule()), 0, 'reviewed'));

        $this->asUser(new RetireCommandRuleCommand(ClassificationRule::query()->sole()->id, 1, 'not needed'));

        $this->assertStringStartsWith('rule-revision-changed', $queued->refresh()->stale_reason);
        $reply = $this->signed(
            $start,
            "/agent/processes/admissions/{$queued->id}",
            ['request_key' => 'stale-1'],
        )->assertStatus(409);
        $this->assertStringContainsString(self::EXPLAIN_AGAIN, (string) $reply->json('message'));
    }

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

        $this->app->make(Supervisor::class)->run($events, $plan, $context);

        $parts = PartRun::query()->where('process_run_id', $run->id)->orderBy('syntax_node')->get();
        $this->assertSame(LifecycleState::Ended, $parts[0]->lifecycle);
        $this->assertSame(LifecycleState::Skipped, $parts[1]->lifecycle);
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
