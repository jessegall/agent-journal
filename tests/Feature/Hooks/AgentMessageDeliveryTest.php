<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Contracts\Actors\AgentTexts;
use App\Enums\Drivers\DriverOperation;
use App\Enums\Drivers\RewriteSupport;
use App\Enums\Engine\NoSubject;
use App\Enums\Files\FileOperation;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Agents\PendingAgentMessage;
use App\Models\Drivers\DriverRequest;
use App\Support\Drivers\DriverCapabilities;
use App\Support\Drivers\DriverReplies;
use App\Support\Inputs\FileEditRequested;
use App\Support\Inputs\PromptSubmitted;
use App\Support\Inputs\Values\FileChange;
use App\Support\Inputs\Values\FileChanges;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\Inputs\Values\PromptDetails;
use App\Support\PendingWorkSources;
use App\Support\References\StateReference;
use Tests\Fixtures\Hooks\MessageState;
use Tests\Support\CommittedHookStack;
use Tests\Support\TestActors;
use Tests\TestCase;

/**
 * A state's message line on a real hook walk: a stop that leaves the agent idle keeps the message and wakes the agent, its
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
        $this->journal->pushState($this->target, new StateReference('test.messaging', NoSubject::None));

        $reply = $this->answerStop();

        $this->assertSame('{}', $reply);
        $this->assertSame(1, PendingAgentMessage::countFor($this->target->actorIdentity()));
        $this->assertSame(1, DriverRequest::query()->where('operation', DriverOperation::Wake)->count());
        $this->assertTrue(
            $this->app->make(PendingWorkSources::class)->hasWorkFor($this->target->actorIdentity()),
        );
    }

    public function test_the_turn_the_wake_starts_gets_the_message_as_context_once(): void
    {
        $this->journal->pushState($this->target, new StateReference('test.messaging', NoSubject::None));
        $this->answerStop();

        $first = $this->answerPrompt('call-2');
        $second = $this->answerPrompt('call-3');

        $this->assertSame(MessageState::TEXT, $this->contextOf($first));
        $this->assertSame('{}', $second);
        $this->assertSame(0, PendingAgentMessage::countFor($this->target->actorIdentity()));
        $this->assertFalse(
            $this->app->make(PendingWorkSources::class)->hasWorkFor($this->target->actorIdentity()),
        );
    }

    public function test_a_busy_agent_gets_the_message_in_the_reply_and_is_not_woken(): void
    {
        $this->journal->pushState($this->target, new StateReference('test.messaging', NoSubject::None));
        $answer = $this->journal->answerHook(
            $this->target,
            new FileEditRequested(
                $this->hookIdentityFor('call-1'),
                new FileChanges([new FileChange('app/Models/Task.php', FileOperation::Edit)]),
            ),
            $this->messagingCapabilities(),
        );
        $reply = DriverReplies::allowTool($answer->context)->stdout;

        $this->assertSame(MessageState::TEXT, $this->contextOf($reply));
        $this->assertSame(0, PendingAgentMessage::countFor($this->target->actorIdentity()));
        $this->assertSame(0, DriverRequest::query()->where('operation', DriverOperation::Wake)->count());
    }

    private function answerPrompt(string $callId): string
    {
        $answer = $this->journal->answerHook(
            $this->target,
            new PromptSubmitted(
                $this->hookIdentityFor($callId),
                new PromptDetails($callId, 'Check your pending journal work.', $callId),
            ),
            $this->messagingCapabilities(),
        );

        return DriverReplies::prompt($answer, $this->app->make(AgentTexts::class))->stdout;
    }

    private function messagingCapabilities(): DriverCapabilities
    {
        return new DriverCapabilities(
            'Test driver',
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
