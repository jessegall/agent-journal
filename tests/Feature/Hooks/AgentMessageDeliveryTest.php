<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Actors\Contracts\ActorAttention;
use App\Actors\Support\AttentionOrigin;
use App\Agents\Enums\DriverOperation;
use App\Agents\Exceptions\StackTargetRefused;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Models\DriverRequest;
use App\Agents\Support\PendingWorkSources;
use App\Agents\Values\StackTarget;
use App\Bus\Support\OperationDeadline;
use App\Hooks\Drivers\DriverCapabilities;
use App\Hooks\Drivers\DriverReplies;
use App\Hooks\Enums\FileOperation;
use App\Hooks\Enums\NoSubject;
use App\Hooks\Enums\RewriteSupport;
use App\Hooks\Inputs\FileEditRequested;
use App\Hooks\Inputs\PromptSubmitted;
use App\Hooks\Inputs\Values\FileChange;
use App\Hooks\Inputs\Values\FileChanges;
use App\Hooks\Inputs\Values\HookIdentity;
use App\Hooks\Inputs\Values\PromptDetails;
use App\Hooks\Models\PendingAgentMessage;
use App\Hooks\References\StateReference;
use App\Hooks\Stack\HookAnswer;
use App\Hooks\StateEvents\StateEventContext;
use App\Hooks\StateEvents\StateEventDispatch;
use App\Hooks\StateEvents\StateEventScope;
use App\Hooks\Support\AgentMessageDelivery;
use App\Hooks\Support\PendingAgentMessages;
use App\Hooks\Support\StackTransaction;
use Tests\Fixtures\Agents\RecordedAttention;
use Tests\Fixtures\Hooks\MessagingState;
use Tests\Fixtures\Modules\Notes\Events\NoteWritten;
use Tests\Support\CommittedHookStack;
use Tests\Support\TestActors;
use Tests\TestCase;

/**
 * Decision::message on a real hook walk: a stop that leaves the agent idle keeps the message and wakes the agent, its
 * next hook hands the message over, and a busy agent gets it in the reply like any context.
 */
final class AgentMessageDeliveryTest extends TestCase
{
    use CommittedHookStack;

    public function test_an_allowed_stop_keeps_the_message_and_wakes_the_idle_agent(): void
    {
        Agent::query()->findOrFail($this->target->agentId)->adoptRuntime(
            AgentSession::query()->findOrFail($this->target->sessionId),
        );
        $this->pushState(new StateReference('test.messaging', NoSubject::None));

        $reply = $this->answerStop('call-1');

        $this->assertSame('{}', $reply);
        $this->assertSame(1, PendingAgentMessage::countFor($this->target->actorIdentity()));
        $this->assertSame(1, DriverRequest::query()->where('operation', DriverOperation::Wake)->count());
        $this->assertTrue(
            $this->app->make(PendingWorkSources::class)->hasWorkFor($this->target->actorIdentity()),
        );
    }

    public function test_the_turn_the_wake_starts_gets_the_message_as_context_once(): void
    {
        $this->pushState(new StateReference('test.messaging', NoSubject::None));
        $this->answerStop('call-1');

        $first = $this->answerPrompt('call-2');
        $second = $this->answerPrompt('call-3');

        $this->assertSame(MessagingState::TEXT, $this->contextOf($first));
        $this->assertSame('{}', $second);
        $this->assertSame(0, PendingAgentMessage::countFor($this->target->actorIdentity()));
        $this->assertFalse(
            $this->app->make(PendingWorkSources::class)->hasWorkFor($this->target->actorIdentity()),
        );
    }

    public function test_a_busy_agent_gets_the_message_in_the_reply_and_is_not_woken(): void
    {
        $this->pushState(new StateReference('test.messaging', NoSubject::None));
        $this->callAs('call-1');

        $reply = $this->machine()->answer(
            new FileEditRequested(
                $this->hookIdentityFor('call-1'),
                new FileChanges([new FileChange('app/Models/Task.php', FileOperation::Edit)]),
            ),
            $this->messagingCapabilities(),
            new OperationDeadline(3000),
            fn (HookAnswer $answer) => DriverReplies::allowTool($answer->context),
        )->stdout;

        $this->assertSame(MessagingState::TEXT, $this->contextOf($reply));
        $this->assertSame(0, PendingAgentMessage::countFor($this->target->actorIdentity()));
        $this->assertSame(0, DriverRequest::query()->where('operation', DriverOperation::Wake)->count());
    }

    public function test_event_context_reaches_the_next_hook_with_one_wake_for_its_message_subset(): void
    {
        $attention = new RecordedAttention();
        $this->app->instance(ActorAttention::class, $attention);
        $delivery = $this->app->make(AgentMessageDelivery::class);
        $work = $this->app->make(PendingAgentMessages::class);
        $transaction = $this->app->make(StackTransaction::class);
        $target = $this->target;
        $actor = $target->actorIdentity();

        $plain = $this->captureFor($target);
        $transaction->run(
            fn () => $delivery->retainEvent($target, $plain, new StateEventContext(['Plain context.'], [])),
        );

        $this->assertSame([], $attention->wakes);
        $this->assertSame(0, $work->pendingCount($actor));

        $marked = $this->captureFor($target);
        $context = new StateEventContext(['Wake once.', 'More context.', 'Wake once.'], ['Wake once.', 'Wake once.']);
        $transaction->run(fn () => $delivery->retainEvent($target, $marked, $context));

        $this->assertEquals([[$actor, AttentionOrigin::stateEvent($marked->id)->keyFor($actor)]], $attention->wakes);
        $this->assertSame(1, $work->pendingCount($actor));
        $this->assertSame(2, PendingAgentMessage::countFor($actor));
        $this->assertSame(
            "Plain context.\nWake once.\nMore context.\nWake once.",
            $this->contextOf($this->answerPrompt('call-2')),
        );
        $this->assertSame('{}', $this->answerPrompt('call-3'));
    }

    public function test_event_context_cannot_be_retained_for_a_target_outside_the_captured_scope(): void
    {
        $dispatch = $this->captureFor($this->target);
        $other = TestActors::stack(2, 20);
        $delivery = $this->app->make(AgentMessageDelivery::class);

        $this->expectException(StackTargetRefused::class);
        $delivery->retainEvent($other, $dispatch, new StateEventContext(['Outside this delivery.'], []));
    }

    private function captureFor(StackTarget $target): StateEventDispatch
    {
        $scope = $this->app->make(StateEventScope::class);

        return $scope->admit([$target], fn () => $scope->capture(new NoteWritten()));
    }

    private function answerPrompt(string $callId): string
    {
        $this->callAs($callId);

        return $this->machine()->answer(
            new PromptSubmitted(
                $this->hookIdentityFor($callId),
                new PromptDetails($callId, 'Check your pending journal work.', $callId),
            ),
            $this->messagingCapabilities(),
            new OperationDeadline(3000),
            fn (HookAnswer $answer) => DriverReplies::prompt($answer),
        )->stdout;
    }

    private function messagingCapabilities(): DriverCapabilities
    {
        return new DriverCapabilities(
            'Test program',
            'prompt, file edit and stop replies',
            ['onPrompt', 'onFileEdit', 'onStop'],
            RewriteSupport::WithoutApproval,
        );
    }

    private function hookIdentityFor(string $callId): HookIdentity
    {
        return TestActors::hookIdentity(1, 10, $callId, self::inputDigest());
    }

    private function contextOf(string $reply): string
    {
        return json_decode($reply, true)['hookSpecificOutput']['additionalContext'];
    }
}
