<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Bus\Contracts\CommandBus;
use App\Communication\Commands\RequireMessageAnswer;
use App\Communication\Enums\MessageState;
use App\Communication\Models\Message;
use App\Hooks\Exceptions\StackAlreadyClosed;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Storage\FrameRecord;
use Carbon\CarbonImmutable;
use Domain\Tasks\Commands\StartTask;
use Domain\Tasks\Models\Task;
use Tests\Support\CommittedHookStack;
use Tests\TestCase;

final class MessageStateContributionTest extends TestCase
{
    use CommittedHookStack;

    public function test_asking_for_an_answer_commits_the_request_and_its_state_together(): void
    {
        $message = Message::write('Which database?');

        $this->app->make(CommandBus::class)->run(new RequireMessageAnswer($message->id, $this->target->sessionId));

        $this->assertSame(MessageState::WaitingForAnswer, $message->fresh()?->state);
        $this->assertSame(['hooks.main_ready', 'communication.answering'], $this->storedTypeKeys());
    }

    public function test_a_failed_push_rolls_the_request_back(): void
    {
        $message = Message::write('Which database?');
        AgentStackRow::query()->sole()->closeAt(CarbonImmutable::now());

        try {
            $this->app->make(CommandBus::class)->run(new RequireMessageAnswer($message->id, $this->target->sessionId));
            $this->fail('The request went through without its push.');
        } catch (StackAlreadyClosed) {
            $this->assertSame(MessageState::Sent, $message->fresh()?->state);
        }
    }

    public function test_an_answered_message_leaves_on_the_next_hook_and_the_task_below_still_holds_the_stop(): void
    {
        $task = Task::factory()->create(['title' => 'Write the walk']);
        $this->app->make(CommandBus::class)->run(new StartTask($task->id, $this->target->sessionId));
        $message = Message::write('Which database?');
        $this->app->make(CommandBus::class)->run(new RequireMessageAnswer($message->id, $this->target->sessionId));

        $whileWaiting = $this->answerStop('call-1');
        $message->markAnswered();
        $afterAnswer = $this->answerStop('call-2');

        $this->assertStringContainsString("Message {$message->number} waits for your answer", $whileWaiting);
        $this->assertStringContainsString("Task {$task->number} still needs work", $afterAnswer);
        $this->assertSame(['hooks.main_ready', 'tasks.working'], $this->storedTypeKeys());
    }

    public function test_a_dismissed_message_also_leaves_on_the_next_hook(): void
    {
        $message = Message::write('Which database?');
        $this->app->make(CommandBus::class)->run(new RequireMessageAnswer($message->id, $this->target->sessionId));

        $message->dismiss();

        $this->assertSame('{}', $this->answerStop('call-1'));
        $this->assertSame(['hooks.main_ready'], array_map(fn (FrameRecord $frame) => $frame->reference->typeKey, AgentStackRow::query()->sole()->frames->all()));
    }
}
