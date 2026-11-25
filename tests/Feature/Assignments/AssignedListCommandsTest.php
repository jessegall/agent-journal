<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Exceptions\StartSettingMissing;
use App\Support\AssigneeIdentity;
use App\Support\SessionTokenSource;
use App\Support\StartEnvironment;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Domain\Plans\PlansDomain;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Symfony\Component\Process\Process;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\AssignmentWriterInTransaction;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\TestCase;

/**
 * The console client of a started driver: "journal task assigned" and "journal plan assigned" ask the real
 * endpoints over a signed call with the start's token and print only what that agent holds; an empty list succeeds,
 * and a refusal, an unreachable journal or missing start settings fail with a message that never shows the token.
 */
final class AssignedListCommandsTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'session_tokens',
        'tasks',
        'plans',
        'assignments',
        'number_groups',
        'command_receipts',
        'inboxes',
        'inbox_members',
    ];

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class, TasksDomain::class);
    }

    private TestStart $caller;

    protected function setUp(): void
    {
        parent::setUp();

        $owner = $this->journal->owner()->ownerUser();
        $this->caller = TestStart::start('read-only-helper');
        $this->journal->actAsUserId($owner->id);
    }

    public function test_the_commands_print_what_the_started_agent_holds(): void
    {
        $writer = $this->app->make(AssignmentWriterInTransaction::class);
        $task = $this->tasks()->task('Write the client')->taskCalled('Write the client');
        $plan = Plan::factory()->create(['title' => 'Release', 'type' => PlanType::Build]);
        $held = $writer->assign(
            $task->assignmentIdentity(),
            AssigneeIdentity::of($this->caller->agent),
        )->outcomes[0]->current;
        $writer->assign($plan->assignmentIdentity(), AssigneeIdentity::of($this->caller->agent));
        $this->journal->relayAgentCommands($this->caller);

        $this->artisan('task:assigned')
            ->expectsTable(['Id', 'Title', 'State', 'Holder', 'Reference'], [
                [
                    $task->id,
                    'Write the client',
                    'open',
                    "agent {$this->caller->agent->id} Test agent",
                    $held->reference->id,
                ],
            ])
            ->expectsOutputToContain('Page 1: 1 of 1')
            ->assertExitCode(0);
        $this->artisan('plan:assigned')
            ->expectsOutputToContain('Release')
            ->expectsOutputToContain('Page 1: 1 of 1')
            ->assertExitCode(0);
        $this->artisan('plan:assigned', ['--json' => true])
            ->expectsOutputToContain('"title":"Release"')
            ->assertExitCode(0);
    }

    public function test_an_agent_holding_nothing_succeeds_with_an_empty_list(): void
    {
        $this->journal->relayAgentCommands($this->caller);

        $this->artisan('task:assigned')->expectsOutputToContain('Page 1: 0 of 0')->assertExitCode(0);
    }

    public function test_a_refusal_or_an_unreachable_journal_fails_without_showing_the_token(): void
    {
        $this->journal->relayAgentCommands($this->caller, 'not-a-start-token');
        $this->artisan('task:assigned')
            ->expectsOutputToContain('The journal refused the call (unauthenticated)')
            ->doesntExpectOutputToContain('not-a-start-token')
            ->assertExitCode(1);

        $this->journal->relayAgentCommands($this->caller);
        $this->artisan(
            'plan:assigned',
            ['--per-page' => 101],
        )->expectsOutputToContain('(invalid_input)')->assertExitCode(1);

        Http::fake(fn () => throw new ConnectionException('Connection refused'));
        $this->artisan('task:assigned')->expectsOutputToContain('did not answer')->assertExitCode(1);
    }

    public function test_the_starter_turns_subject_and_verb_into_the_command_and_needs_the_start_settings(): void
    {
        $this->assertThrows(
            fn () => new SessionTokenSource(new StartEnvironment([]))->forThisStart(),
            StartSettingMissing::class,
        );

        $process = new Process(
            [base_path('bin/journal'), 'task', 'assigned'],
            base_path(),
            ['JOURNAL_URL' => false, 'JOURNAL_START_TOKEN' => false],
        );
        $process->run();

        $this->assertNotSame(0, $process->getExitCode());
        $this->assertStringContainsString('JOURNAL_URL', $process->getOutput().$process->getErrorOutput());
    }

    private function tasks(): TaskFixtures
    {
        return $this->journal->fixtures(TaskFixtures::class);
    }
}
