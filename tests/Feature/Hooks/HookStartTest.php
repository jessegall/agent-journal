<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Api\Hooks\AgentStateMachine;
use App\Contracts\Actors\AgentTexts;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Enums\Drivers\RewriteSupport;
use App\Exceptions\ProfileMissing;
use App\Models\Agents\AgentSession;
use App\Models\Agents\AgentStackRow;
use App\Support\ActorContext;
use App\Support\AgentContext;
use App\Support\CredentialLookup;
use App\Support\Drivers\Adapters\ClaudeCodeAdapter;
use App\Support\Drivers\DriverCapabilities;
use App\Support\Drivers\DriverReplies;
use App\Support\Inputs\StopRequested;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\Inputs\Values\StopDetails;
use App\Support\OperationDeadline;
use App\Support\SignedCall;
use App\Support\Stack\HookAnswer;
use App\Support\StartedAgent;
use App\Support\StartSessions;
use App\Support\Storage\FrameRecord;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use Closure;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\TestStartAuthority;
use Tests\TestCase;

final class HookStartTest extends TestCase
{
    use CommitsHookRows;

    private const string STILL_NEEDS_WORK = 'Task %d still needs work';

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'tasks',
        'links',
        'driver_conversations',
        'conversation_visits',
        'process_events',
        'part_runs',
        'process_runs',
        'command_requests',
    ];

    private int $startCount = 0;

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    public function test_the_isolated_settings_hold_only_the_journal_hooks_and_turn_off_the_child_tool(): void
    {
        $settings = json_decode($this->start('main-agent')->settings, true, flags: JSON_THROW_ON_ERROR);

        $this->assertSame(['hooks', 'permissions'], array_keys($settings));
        $this->assertSame(
            ['SessionStart', 'UserPromptSubmit', 'PreToolUse', 'PostToolUse', 'Stop', 'StopFailure', 'SessionEnd'],
            array_keys($settings['hooks']),
        );
        $this->assertSame(
            [['hooks' => [['type' => 'command', 'command' => 'journal-hook claude-code']]]],
            $settings['hooks']['Stop'],
        );
        $this->assertSame(
            ['allow' => ['mcp__journal__*'], 'deny' => ClaudeCodeAdapter::NATIVE_CHILD_TOOLS],
            $settings['permissions'],
        );
    }

    public function test_each_start_gets_its_own_session_credential_and_stack(): void
    {
        $first = $this->start('main-agent');
        $second = $this->start('main-agent');

        $this->assertNotSame($first->session->id, $second->session->id);
        $this->assertNotSame($first->token, $second->token);
        $this->assertSame('claude-code', $first->session->fresh()?->driver_key);
        $this->assertSame(
            $second->session->id,
            $this->app->make(CredentialLookup::class)->sessionFor($second->token)->id,
        );
        $this->assertSame(['core.ready'], $this->bottomOf($first));
        $this->assertSame(['core.ready'], $this->bottomOf($second));
    }

    public function test_an_unknown_profile_refuses_the_start_and_keeps_nothing(): void
    {
        try {
            $this->start('no-such-profile');
            $this->fail('A start with an unknown profile went through.');
        } catch (ProfileMissing) {
            $this->assertSame(0, AgentSession::query()->count());
            $this->assertSame(0, AgentStackRow::query()->acrossEveryAgent()->count());
        }
    }

    public function test_a_child_has_its_own_stack_so_its_stop_does_not_answer_for_the_parent(): void
    {
        $parent = $this->start('main-agent');
        $task = Task::factory()->create(['title' => 'Write the walk']);
        $this->as($parent, fn () => $this->app->make(CommandBus::class)->run(new StartTaskCommand($task->id)));
        $childAgent = $this->journal->idleAgent('Helper', 'read-only-helper')->agentCalled('Helper');

        $child = $this->app->make(StartSessions::class)->start(
            $childAgent,
            TestSelections::of('claude-code'),
            TestSelections::requestId(),
            $parent->session,
        );

        $this->assertSame($parent->session->id, $child->session->fresh()?->parent_session_id);
        $this->assertSame('{}', $this->stopAs($child, 'call-1'));
        $held = $this->stopAs($parent, 'call-2');

        $this->assertStringContainsString(sprintf(self::STILL_NEEDS_WORK, $task->number), $held);
    }

    private function start(string $profileKey, string $driver = 'claude-code'): StartedAgent
    {
        $agent = $this->journal->idleAgent('Test agent '.++$this->startCount, $profileKey)->agentCalled('Test agent '.$this->startCount);

        return $this->app->make(StartSessions::class)->start(
            $agent,
            TestSelections::of($driver),
            TestSelections::requestId(),
        );
    }

    /**
     * @return list<string>
     */
    private function bottomOf(StartedAgent $started): array
    {
        return array_map(
            fn (FrameRecord $frame) => $frame->reference->typeKey,
            AgentStackRow::query()->authorizedFor($this->targetOf($started))->sole()->frames->all(),
        );
    }

    private function stopAs(StartedAgent $started, string $callId): string
    {
        return $this->as($started, function () use ($started, $callId): string {
            $stop = new StopRequested(
                new HookIdentity(
                    $started->session->agent_id,
                    $started->session->id,
                    $callId,
                    hash('sha256', $callId),
                ),
                new StopDetails('turn-1', false, ''),
            );
            $capabilities = new DriverCapabilities(
                'Test driver',
                'stop replies',
                ['onStop'],
                RewriteSupport::WithoutApproval,
            );

            return $this->app->make(AgentStateMachine::class)->answer(
                $stop,
                $capabilities,
                new OperationDeadline(3000),
                fn (HookAnswer $answer, AgentTexts $texts) => DriverReplies::stop($answer, $texts),
            )->stdout;
        }, $callId);
    }

    /**
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    private function as(StartedAgent $started, Closure $work, string $callId = 'setup'): mixed
    {
        $this->app->forgetScopedInstances();
        $this->app->instance(AgentContext::class, new AgentContext(
            $started->session->agent_id,
            $started->session->id,
            new SignedCall($callId, CarbonImmutable::now(), hash('sha256', $callId)),
            null,
        ));
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent($started->session->agent_id),
            TestStartAuthority::forAgent($started->session->agent_id),
        );

        try {
            return $work();
        } finally {
            $this->app->forgetScopedInstances();
        }
    }

    private function targetOf(StartedAgent $started): StackTarget
    {
        return new StackTarget($started->session->agent_id, $started->session->id);
    }
}
