<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\AgentRequests\Exceptions\LaunchSettingMissing;
use App\AgentRequests\Support\EnvironmentCredentialSource;
use App\Assignments\Support\AssigneeIdentity;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Domain\Tasks\Models\Task;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Symfony\Component\Process\Process;
use Tests\Fixtures\Agents\TestLaunch;
use Tests\Support\AssignmentWriterInTransaction;
use Tests\Support\CommitsHookRows;
use Tests\Support\SendsSignedCalls;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * The console client of a launched program: "journal task assigned" and "journal plan assigned" ask the real
 * endpoints over a signed call with the launch's token and print only what that agent holds; an empty list succeeds,
 * and a refusal, an unreachable journal or missing launch settings fail with a message that never shows the token.
 */
final class AssignedListCommandsTest extends TestCase
{
    use CommitsHookRows;
    use SendsSignedCalls;
    use StartsAgentRequests;

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'launch_credentials',
        'tasks',
        'plans',
        'assignments',
    ];

    private TestLaunch $caller;

    protected function setUp(): void
    {
        parent::setUp();

        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->caller = TestLaunch::start('read-only-helper');
        $this->startUserRequestAs($owner->id);
    }

    public function test_the_commands_print_what_the_launched_agent_holds(): void
    {
        $writer = $this->app->make(AssignmentWriterInTransaction::class);
        $task = Task::factory()->create(['title' => 'Write the client']);
        $plan = Plan::factory()->create(['title' => 'Release', 'type' => PlanType::Build]);
        $held = $writer->assign(
            $task->assignmentIdentity(),
            AssigneeIdentity::of($this->caller->agent),
        )->outcomes[0]->current;
        $writer->assign($plan->assignmentIdentity(), AssigneeIdentity::of($this->caller->agent));
        $this->runCommandsAs($this->caller);

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
        $this->artisan('plan:assigned', ['--json' => true])
            ->expectsOutputToContain('"title":"Release"')
            ->assertExitCode(0);
    }

    public function test_an_agent_holding_nothing_succeeds_with_an_empty_list(): void
    {
        $this->runCommandsAs($this->caller);

        $this->artisan('task:assigned')->expectsOutputToContain('Page 1: 0 of 0')->assertExitCode(0);
    }

    public function test_a_refusal_or_an_unreachable_journal_fails_without_showing_the_token(): void
    {
        $this->runCommandsAs($this->caller, 'not-a-launch-token');
        $this->artisan('task:assigned')->expectsOutputToContain('The journal refused the call (unauthenticated)')->doesntExpectOutputToContain('not-a-launch-token')->assertExitCode(1);

        $this->runCommandsAs($this->caller);
        $this->artisan(
            'plan:assigned',
            ['--per-page' => 101],
        )->expectsOutputToContain('(invalid_input)')->assertExitCode(1);

        Http::fake(fn () => throw new ConnectionException('Connection refused'));
        $this->artisan('task:assigned')->expectsOutputToContain('did not answer')->assertExitCode(1);
    }

    public function test_the_launcher_turns_subject_and_verb_into_the_command_and_needs_the_launch_settings(): void
    {
        $this->assertThrows(fn () => new EnvironmentCredentialSource([])->forThisLaunch(), LaunchSettingMissing::class);

        $process = new Process(
            [base_path('bin/journal'), 'task', 'assigned'],
            base_path(),
            ['JOURNAL_URL' => false, 'JOURNAL_LAUNCH_TOKEN' => false],
        );
        $process->run();

        $this->assertNotSame(0, $process->getExitCode());
        $this->assertStringContainsString('JOURNAL_URL', $process->getOutput().$process->getErrorOutput());
    }
}
