<?php

declare(strict_types=1);

namespace Tests\Feature\Chat;

use App\Core\Hooks\Models\AgentStackRow;
use App\Core\Hooks\Models\StackAlreadyClosed;
use App\Core\Hooks\Storage\FrameRecord;
use App\Domain\Chat\MessageState;
use App\Domain\Chat\Models\Message;
use App\Domain\Chat\RequireMessageAnswer;
use App\Domain\Tasks\Models\Task;
use App\Domain\Tasks\StartTask;
use Carbon\CarbonImmutable;
use Tests\Support\CommittedHookStack;
use Tests\TestCase;

final class MessageStateContributionTest extends TestCase
{
    use CommittedHookStack;

    public function test_asking_for_an_answer_commits_the_request_and_its_state_together(): void
    {
        $message = Message::query()->create(['body' => 'Which database?']);

        $this->app->make(RequireMessageAnswer::class)->require($message, $this->target);

        $this->assertSame(MessageState::WaitingForAnswer, $message->fresh()?->state);
        $this->assertSame(['hooks.main_ready', 'chat.answering'], $this->storedTypeKeys());
    }

    public function test_a_failed_push_rolls_the_request_back(): void
    {
        $message = Message::query()->create(['body' => 'Which database?']);
        AgentStackRow::query()->sole()->closeAt(CarbonImmutable::now());

        try {
            $this->app->make(RequireMessageAnswer::class)->require($message, $this->target);
            $this->fail('The request went through without its push.');
        } catch (StackAlreadyClosed) {
            $this->assertSame(MessageState::Sent, $message->fresh()?->state);
        }
    }

    public function test_an_answered_message_leaves_on_the_next_hook_and_the_task_below_still_holds_the_stop(): void
    {
        $task = Task::query()->create(['title' => 'Write the walk']);
        $this->app->make(StartTask::class)->start($task, $this->target);
        $message = Message::query()->create(['body' => 'Which database?']);
        $this->app->make(RequireMessageAnswer::class)->require($message, $this->target);

        $whileWaiting = $this->answerStop('call-1');
        $message->markAnswered();
        $afterAnswer = $this->answerStop('call-2');

        $this->assertStringContainsString("Message {$message->id} waits for your answer", $whileWaiting);
        $this->assertStringContainsString("Task {$task->id} still needs work", $afterAnswer);
        $this->assertSame(['hooks.main_ready', 'tasks.working'], $this->storedTypeKeys());
    }

    public function test_a_dismissed_message_also_leaves_on_the_next_hook(): void
    {
        $message = Message::query()->create(['body' => 'Which database?']);
        $this->app->make(RequireMessageAnswer::class)->require($message, $this->target);

        $message->dismiss();

        $this->assertSame('{}', $this->answerStop('call-1'));
        $this->assertSame(['hooks.main_ready'], array_map(fn (FrameRecord $frame) => $frame->reference->typeKey, AgentStackRow::query()->sole()->frames->all()));
    }
}
