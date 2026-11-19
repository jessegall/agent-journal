<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\AgentRequests\Support\SignedCall;
use App\Agents\Actions\LaunchSessions;
use App\Agents\Actions\RecordConversationVisit;
use App\Agents\Exceptions\CredentialRejected;
use App\Agents\Exceptions\ProgramUnsupported;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Support\AgentContext;
use App\Agents\Support\CredentialLookup;
use App\Agents\Support\LaunchedAgent;
use App\Agents\Support\StackTarget;
use App\Bus\Contracts\CommandBus;
use App\Bus\Support\OperationDeadline;
use App\Hooks\Enums\RewriteSupport;
use App\Hooks\Enums\StackStatus;
use App\Hooks\Inputs\HookIdentity;
use App\Hooks\Inputs\StopDetails;
use App\Hooks\Inputs\StopRequested;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Programs\ProgramCapabilities;
use App\Hooks\Programs\ProgramReplies;
use App\Hooks\Stack\AgentStateMachine;
use App\Hooks\Stack\HookAnswer;
use App\Hooks\States\ReadyState;
use App\Hooks\Storage\FrameRecord;
use App\Profiles\Exceptions\ProfileMissing;
use App\Programs\Enums\HookProgram;
use Carbon\CarbonImmutable;
use Closure;
use Domain\Tasks\Commands\StartTask;
use Domain\Tasks\Models\Task;
use Illuminate\Support\Facades\DB;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestLaunchAuthority;
use Tests\TestCase;

final class HookLaunchTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'launch_credentials',
        'agent_stacks',
        'hook_calls',
        'tasks',
        'links',
        'program_conversations',
        'conversation_visits',
        'process_events',
        'part_runs',
        'process_runs',
        'command_requests',
    ];

    public function test_the_isolated_settings_hold_only_the_journal_hooks_and_turn_off_the_child_tool(): void
    {
        $settings = json_decode($this->launch('main-agent')->settings, true, flags: JSON_THROW_ON_ERROR);

        $this->assertSame(['hooks', 'permissions'], array_keys($settings));
        $this->assertSame(
            ['SessionStart', 'UserPromptSubmit', 'PreToolUse', 'PostToolUse', 'Stop', 'SessionEnd'],
            array_keys($settings['hooks']),
        );
        $this->assertSame(
            [['hooks' => [['type' => 'command', 'command' => 'journal-hook claude-code']]]],
            $settings['hooks']['Stop'],
        );
        $this->assertSame(['deny' => HookProgram::ClaudeCode->nativeChildTools()], $settings['permissions']);
    }

    public function test_each_launch_gets_its_own_session_credential_and_stack(): void
    {
        $first = $this->launch('main-agent');
        $second = $this->launch('main-agent');

        $this->assertNotSame($first->session->id, $second->session->id);
        $this->assertNotSame($first->token, $second->token);
        $this->assertSame('claude-code', $first->session->fresh()?->program);
        $this->assertSame(
            $second->session->id,
            $this->app->make(CredentialLookup::class)->sessionFor($second->token)->id,
        );
        $this->assertSame(['hooks.ready'], $this->bottomOf($first));
        $this->assertSame(['hooks.ready'], $this->bottomOf($second));
    }

    public function test_every_launch_starts_on_the_one_ready_bottom(): void
    {
        $this->assertSame([ReadyState::TYPE_KEY], $this->bottomOf($this->launch('read-only-helper')));
    }

    public function test_an_unknown_profile_refuses_the_launch_and_keeps_nothing(): void
    {
        try {
            $this->launch('no-such-profile');
            $this->fail('A launch with an unknown profile went through.');
        } catch (ProfileMissing) {
            $this->assertSame(0, AgentSession::query()->count());
            $this->assertSame(0, DB::table('agent_stacks')->count());
        }
    }

    public function test_a_program_without_journal_hooks_cannot_be_launched(): void
    {
        $this->expectException(ProgramUnsupported::class);

        $this->launch('main-agent', 'some-other-program');
    }

    public function test_a_clear_or_resume_keeps_the_journal_session_and_its_stack(): void
    {
        $launched = $this->launch('main-agent');
        $visits = $this->app->make(RecordConversationVisit::class);

        $visits->entered($launched->session->id, 'program-session-1', 'call-1', CarbonImmutable::now());
        $framesBefore = $this->bottomOf($launched);
        $visits->entered($launched->session->id, 'program-session-2', 'call-2', CarbonImmutable::now());

        $this->assertSame(1, AgentSession::query()->count());
        $this->assertSame(
            'program-session-2',
            $launched->session->fresh(['currentConversation'])?->currentConversation?->native_id,
        );
        $this->assertSame($framesBefore, $this->bottomOf($launched));
        $this->assertSame(
            $launched->session->id,
            $this->app->make(CredentialLookup::class)->sessionFor($launched->token)->id,
        );
    }

    public function test_a_child_has_its_own_stack_so_its_stop_does_not_answer_for_the_parent(): void
    {
        $parent = $this->launch('main-agent');
        $task = Task::factory()->create(['title' => 'Write the walk']);
        $this->as($parent, fn () => $this->app->make(CommandBus::class)->run(new StartTask($task->id)));
        $childAgent = Agent::named('Helper', 'read-only-helper');

        $child = $this->app->make(LaunchSessions::class)->launch(
            $childAgent,
            TestSelections::of('claude-code'),
            TestSelections::requestId(),
            $parent->session,
        );

        $this->assertSame($parent->session->id, $child->session->fresh()?->parent_session_id);
        $this->assertSame('{}', $this->stopAs($child, 'call-1'));
        $this->assertStringContainsString("Task {$task->number} still needs work", $this->stopAs($parent, 'call-2'));
    }

    public function test_ending_a_launch_closes_its_stack_and_revokes_its_credential(): void
    {
        $launched = $this->launch('main-agent');

        $this->app->make(LaunchSessions::class)->end($launched->session);

        $this->assertSame(
            StackStatus::Closed,
            AgentStackRow::query()->authorizedFor($this->targetOf($launched))->sole()->status,
        );
        $this->expectException(CredentialRejected::class);
        $this->app->make(CredentialLookup::class)->sessionFor($launched->token);
    }

    private function launch(string $profileKey, string $program = 'claude-code'): LaunchedAgent
    {
        $agent = Agent::named('Test agent', $profileKey);

        return $this->app->make(LaunchSessions::class)->launch(
            $agent,
            TestSelections::of($program),
            TestSelections::requestId(),
        );
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
            $stop = new StopRequested(
                new HookIdentity($launched->session->agent_id, $launched->session->id, $callId, hash('sha256', $callId)),
                new StopDetails('turn-1', false),
            );
            $capabilities = new ProgramCapabilities(
                'Test program',
                'stop replies',
                ['onStop'],
                RewriteSupport::WithoutApproval,
            );

            return $this->app->make(AgentStateMachine::class)->answer(
                $stop,
                $capabilities,
                new OperationDeadline(3000),
                fn (HookAnswer $answer) => ProgramReplies::stop($answer),
            )->stdout;
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
            new SignedCall($callId, CarbonImmutable::now(), hash('sha256', $callId)),
            null,
        ));
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent($launched->session->agent_id),
            TestLaunchAuthority::forAgent($launched->session->agent_id),
        );

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
