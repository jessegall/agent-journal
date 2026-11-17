<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Core\Agents\AgentContext;
use App\Core\Agents\CredentialLookup;
use App\Core\Agents\Exceptions\CredentialRejected;
use App\Core\Agents\Exceptions\LaunchRefused;
use App\Core\Agents\LaunchedAgent;
use App\Core\Agents\LaunchSessions;
use App\Core\Agents\Models\Agent;
use App\Core\Agents\Models\AgentSession;
use App\Core\Agents\NativeChildSessions;
use App\Core\Agents\SignedCall;
use App\Core\Hooks\AgentStateMachine;
use App\Core\Hooks\Exceptions\CommandFactsMissing;
use App\Core\Hooks\Exceptions\UnknownReadyState;
use App\Core\Hooks\Inputs\HookIdentity;
use App\Core\Hooks\Inputs\MissingCommandFacts;
use App\Core\Hooks\Inputs\ShellCommandParser;
use App\Core\Hooks\Inputs\StopDetails;
use App\Core\Hooks\Inputs\StopRequested;
use App\Core\Hooks\Models\AgentStackRow;
use App\Core\Hooks\OperationDeadline;
use App\Core\Hooks\Programs\ProgramCapabilities;
use App\Core\Hooks\Programs\ProgramReplies;
use App\Core\Hooks\Programs\RewriteSupport;
use App\Core\Hooks\Stack\HookAnswer;
use App\Core\Hooks\Storage\FrameRecord;
use App\Core\Hooks\Storage\StackStatus;
use App\Core\Hooks\Storage\StackTarget;
use App\Domain\Tasks\Models\Task;
use App\Domain\Tasks\StartTask;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Support\Facades\DB;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

final class HookLaunchTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['agents', 'agent_sessions', 'launch_credentials', 'agent_stacks', 'hook_calls', 'tasks', 'links'];

    public function test_the_isolated_settings_hold_only_the_journal_hooks_and_turn_off_the_child_tool(): void
    {
        $settings = json_decode($this->launch('hooks.main_ready')->settings, true, flags: JSON_THROW_ON_ERROR);

        $this->assertSame(['hooks', 'permissions'], array_keys($settings));
        $this->assertSame(['SessionStart', 'UserPromptSubmit', 'PreToolUse', 'PostToolUse', 'Stop', 'SessionEnd'], array_keys($settings['hooks']));
        $this->assertSame([['hooks' => [['type' => 'command', 'command' => 'journal-hook claude-code']]]], $settings['hooks']['Stop']);
        $this->assertSame(['deny' => ['Task']], $settings['permissions']);
    }

    public function test_each_launch_gets_its_own_session_credential_and_stack(): void
    {
        $first = $this->launch('hooks.main_ready');
        $second = $this->launch('hooks.main_ready');

        $this->assertNotSame($first->session->id, $second->session->id);
        $this->assertNotSame($first->token, $second->token);
        $this->assertSame('claude-code', $first->session->fresh()?->program);
        $this->assertSame($second->session->id, $this->app->make(CredentialLookup::class)->sessionFor($second->token)->id);
        $this->assertSame(['hooks.main_ready'], $this->bottomOf($first));
        $this->assertSame(['hooks.main_ready'], $this->bottomOf($second));
    }

    public function test_the_role_of_the_agent_selects_its_bottom_state(): void
    {
        $this->assertSame(['hooks.read_only_helper_ready'], $this->bottomOf($this->launch('hooks.read_only_helper_ready')));
    }

    public function test_an_unknown_role_refuses_the_launch_and_keeps_nothing(): void
    {
        try {
            $this->launch('hooks.ready');
            $this->fail('A launch with an unknown role went through.');
        } catch (UnknownReadyState) {
            $this->assertSame(0, AgentSession::query()->count());
            $this->assertSame(0, DB::table('agent_stacks')->count());
        }
    }

    public function test_a_launch_without_a_command_parser_is_refused_and_keeps_nothing(): void
    {
        $this->app->instance(ShellCommandParser::class, new MissingCommandFacts);

        try {
            $this->launch('hooks.main_ready');
            $this->fail('A launch without a command parser went through.');
        } catch (CommandFactsMissing) {
            $this->assertSame(0, AgentSession::query()->count());
        }
    }

    public function test_a_program_without_journal_hooks_cannot_be_launched(): void
    {
        $this->expectException(LaunchRefused::class);

        $this->launch('hooks.main_ready', 'some-other-program');
    }

    public function test_a_clear_or_resume_keeps_the_journal_session_and_its_stack(): void
    {
        $launched = $this->launch('hooks.main_ready');
        $sessions = $this->app->make(LaunchSessions::class);

        $sessions->mapProgramSession($launched->session, 'program-session-1');
        $framesBefore = $this->bottomOf($launched);
        $sessions->mapProgramSession($launched->session, 'program-session-2');

        $this->assertSame(1, AgentSession::query()->count());
        $this->assertSame('program-session-2', $launched->session->fresh()?->program_session_id);
        $this->assertSame($framesBefore, $this->bottomOf($launched));
        $this->assertSame($launched->session->id, $this->app->make(CredentialLookup::class)->sessionFor($launched->token)->id);
    }

    public function test_a_child_has_its_own_stack_so_its_stop_does_not_answer_for_the_parent(): void
    {
        $parent = $this->launch('hooks.main_ready');
        $task = Task::query()->create(['title' => 'Write the walk']);
        $this->as($parent, fn () => $this->app->make(StartTask::class)->start($task, $this->targetOf($parent)));
        $childAgent = Agent::query()->create(['name' => 'Helper', 'role' => 'hooks.read_only_helper_ready']);

        $child = $this->app->make(NativeChildSessions::class)->open($parent->session, $childAgent, 'claude-code');

        $this->assertSame($parent->session->id, $child->session->fresh()?->parent_session_id);
        $this->assertSame('{}', $this->stopAs($child, 'call-1'));
        $this->assertStringContainsString("Task {$task->id} still needs work", $this->stopAs($parent, 'call-2'));
    }

    public function test_ending_a_launch_closes_its_stack_and_revokes_its_credential(): void
    {
        $launched = $this->launch('hooks.main_ready');

        $this->app->make(LaunchSessions::class)->end($launched->session);

        $this->assertSame(StackStatus::Closed, AgentStackRow::query()->authorizedFor($this->targetOf($launched))->sole()->status);
        $this->expectException(CredentialRejected::class);
        $this->app->make(CredentialLookup::class)->sessionFor($launched->token);
    }

    private function launch(string $role, string $program = 'claude-code'): LaunchedAgent
    {
        $agent = Agent::query()->create(['name' => 'Test agent', 'role' => $role]);

        return $this->app->make(LaunchSessions::class)->launch($agent, $program);
    }

    /**
     * @return list<string>
     */
    private function bottomOf(LaunchedAgent $launched): array
    {
        return array_map(
            fn (FrameRecord $frame) => $frame->reference->typeKey,
            AgentStackRow::query()->authorizedFor($this->targetOf($launched))->sole()->frames->all(),
        );
    }

    private function stopAs(LaunchedAgent $launched, string $callId): string
    {
        return $this->as($launched, function () use ($launched, $callId): string {
            $stop = new StopRequested(new HookIdentity($launched->session->agent_id, $launched->session->id, $callId, hash('sha256', $callId)), new StopDetails('turn-1', false));
            $capabilities = new ProgramCapabilities('Test program', 'stop replies', ['onStop'], RewriteSupport::WithoutApproval);

            return $this->app->make(AgentStateMachine::class)->answer($stop, $capabilities, new OperationDeadline(3000), fn (HookAnswer $answer) => ProgramReplies::stop($answer))->stdout;
        }, $callId);
    }

    /**
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    private function as(LaunchedAgent $launched, Closure $work, string $callId = 'setup'): mixed
    {
        $this->app->forgetScopedInstances();
        $this->app->instance(AgentContext::class, new AgentContext(
            $launched->session->agent_id,
            $launched->session->id,
            $launched->session->agent->role,
            new SignedCall($callId, CarbonImmutable::now(), hash('sha256', $callId)),
        ));

        try {
            return $work();
        } finally {
            $this->app->forgetScopedInstances();
        }
    }

    private function targetOf(LaunchedAgent $launched): StackTarget
    {
        return new StackTarget($launched->session->agent_id, $launched->session->id);
    }
}
