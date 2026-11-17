<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Core\Actors\Support\ActorIdentity;
use App\Core\Agents\Exceptions\LaunchSettingMissing;
use App\Core\Agents\Support\AgentClientSettings;
use App\Core\Assignments\Contracts\AssignmentWriter;
use App\Core\Contracts\CurrentActorSetter;
use App\Domain\Access\Models\User;
use App\Domain\Access\Support\AccessSettings;
use App\Domain\Plans\Enums\PlanKind;
use App\Domain\Plans\Models\Plan;
use App\Domain\Tasks\Models\Task;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Symfony\Component\Process\Process;
use Tests\Fixtures\Agents\TestLaunch;
use Tests\Support\CommitsHookRows;
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
    use StartsAgentRequests;

    private const array TABLES = ['users', 'agents', 'agent_sessions', 'launch_credentials', 'tasks', 'plans', 'assignments'];

    private TestLaunch $caller;

    protected function setUp(): void
    {
        parent::setUp();

        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->caller = TestLaunch::start('hooks.read_only_helper_ready');
        $this->startUserRequestAs($owner->id);
    }

    public function test_the_commands_print_what_the_launched_agent_holds(): void
    {
        $writer = $this->app->make(AssignmentWriter::class);
        $task = Task::query()->create(['title' => 'Write the client']);
        $plan = Plan::query()->create(['title' => 'Release', 'kind' => PlanKind::Build]);
        $held = $writer->assign($task->assignmentIdentity(), ActorIdentity::of($this->caller->agent))->outcomes[0]->current->get();
        $writer->assign($plan->assignmentIdentity(), ActorIdentity::of($this->caller->agent));
        $this->useLaunchToken($this->caller->token);

        $this->artisan('task:assigned')
            ->expectsTable(['Id', 'Title', 'State', 'Holder', 'Reference'], [
                [$task->id, 'Write the client', 'open', "agent {$this->caller->agent->id} Test agent", $held->reference->id],
            ])
            ->expectsOutputToContain('Page 1: 1 of 1')
            ->assertExitCode(0);
        $this->artisan('plan:assigned', ['--json' => true])
            ->expectsOutputToContain('"title":"Release"')
            ->assertExitCode(0);
    }

    public function test_an_agent_holding_nothing_succeeds_with_an_empty_list(): void
    {
        $this->useLaunchToken($this->caller->token);

        $this->artisan('task:assigned')->expectsOutputToContain('Page 1: 0 of 0')->assertExitCode(0);
    }

    public function test_a_refusal_or_an_unreachable_journal_fails_without_showing_the_token(): void
    {
        $this->useLaunchToken('not-a-launch-token');
        $this->artisan('task:assigned')->expectsOutputToContain('The journal refused the call (401)')->doesntExpectOutputToContain('not-a-launch-token')->assertExitCode(1);

        $this->useLaunchToken($this->caller->token);
        $this->artisan('plan:assigned', ['--per-page' => 101])->expectsOutputToContain('(422)')->assertExitCode(1);

        Http::fake(fn () => throw new ConnectionException('Connection refused'));
        $this->artisan('task:assigned')->expectsOutputToContain('did not answer')->assertExitCode(1);
    }

    public function test_the_launcher_turns_subject_and_verb_into_the_command_and_needs_the_launch_settings(): void
    {
        $this->assertThrows(fn () => AgentClientSettings::fromEnvironment([]), LaunchSettingMissing::class);

        $process = new Process([base_path('bin/journal'), 'task', 'assigned'], base_path(), ['JOURNAL_URL' => false, 'JOURNAL_LAUNCH_TOKEN' => false]);
        $process->run();

        $this->assertNotSame(0, $process->getExitCode());
        $this->assertStringContainsString('JOURNAL_URL', $process->getOutput().$process->getErrorOutput());
    }

    /**
     * Gives the commands the launch's settings and sends their signed calls through the application's own HTTP kernel.
     */
    private function useLaunchToken(string $token): void
    {
        $this->app->instance(AgentClientSettings::class, new AgentClientSettings('http://journal.test', $token));
        Http::fake(function (Request $request) {
            $server = ['CONTENT_TYPE' => 'application/json'];

            foreach ($request->headers() as $name => $values) {
                $server['HTTP_'.strtoupper(str_replace('-', '_', $name))] = $values[0];
            }

            $this->app->make(CurrentActorSetter::class)->clear();
            $this->app->forgetScopedInstances();
            $response = $this->call('POST', (string) parse_url($request->url(), PHP_URL_PATH), server: $server, content: $request->body());

            return Http::response((string) $response->getContent(), $response->getStatusCode());
        });
    }
}
