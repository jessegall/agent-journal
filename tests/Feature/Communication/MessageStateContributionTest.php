<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Bus\Contracts\CommandBus;
use App\Communication\Commands\AnswerMessage;
use App\Communication\Commands\RequireMessageAnswer;
use App\Communication\Enums\MessageState;
use App\Communication\Exceptions\MessageRoundStale;
use App\Communication\Models\Message;
use App\Hooks\Exceptions\StackAlreadyClosed;
use App\Hooks\Models\AgentStackRow;
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

        $this->app->make(CommandBus::class)->run(new RequireMessageAnswer($message->id, $this->target->sessionId, $message->answer_round));

        $this->assertSame(MessageState::WaitingForAnswer, $message->fresh()?->state);
        $this->assertSame(['hooks.main_ready', 'communication.answering'], $this->storedTypeKeys());
    }

    public function test_a_failed_push_rolls_the_request_back(): void
    {
        $message = Message::write('Which database?');
        AgentStackRow::query()->sole()->closeAt(CarbonImmutable::now());

        try {
            $this->app->make(CommandBus::class)->run(new RequireMessageAnswer($message->id, $this->target->sessionId, $message->answer_round));
            $this->fail('The request went through without its push.');
        } catch (StackAlreadyClosed) {
            $this->assertSame(MessageState::Sent, $message->fresh()?->state);
        }
    }

    public function test_an_answered_message_is_passed_over_and_the_task_below_still_holds_the_stop(): void
    {
        $task = Task::factory()->create(['title' => 'Write the walk']);
        $this->app->make(CommandBus::class)->run(new StartTask($task->id, $this->target->sessionId));
        $message = Message::write('Which database?');
        $this->app->make(CommandBus::class)->run(new RequireMessageAnswer($message->id, $this->target->sessionId, $message->answer_round));

        $whileWaiting = $this->answerStop('call-1');
        $message->markAnswered();
        $afterAnswer = $this->answerStop('call-2');

        $this->assertStringContainsString("Message {$message->number} waits for your answer", $whileWaiting);
        $this->assertStringContainsString("Task {$task->number} still needs work", $afterAnswer);
        $this->assertSame(['hooks.main_ready', 'tasks.working', 'communication.answering'], $this->storedTypeKeys());
    }

    public function test_a_dismissed_message_is_also_passed_over_and_stays_stored(): void
    {
        $message = Message::write('Which database?');
        $this->app->make(CommandBus::class)->run(new RequireMessageAnswer($message->id, $this->target->sessionId, $message->answer_round));

        $message->dismiss();

        $this->assertSame('{}', $this->answerStop('call-1'));
        $this->assertSame(['hooks.main_ready', 'communication.answering'], $this->storedTypeKeys());
    }

    public function test_asking_again_opens_a_new_round_whose_old_frame_stays_finished(): void
    {
        $message = Message::write('Which database?');
        $bus = $this->app->make(CommandBus::class);

        $bus->run(new RequireMessageAnswer($message->id, $this->target->sessionId, 0));
        $bus->run(new AnswerMessage($message->id, 1));
        $bus->run(new RequireMessageAnswer($message->id, $this->target->sessionId, 1));
        $asked = $message->fresh();

        $this->assertSame(2, $asked?->answer_round);
        $this->assertFalse($asked->workIn(1)->needsReply());
        $this->assertTrue($asked->workIn(2)->needsReply());
        $this->assertStringContainsString('--round 2', $asked->work()->replyInstruction());
    }

    public function test_an_answer_for_an_old_round_is_refused_and_changes_nothing(): void
    {
        $message = Message::write('Which database?');
        $bus = $this->app->make(CommandBus::class);
        $bus->run(new RequireMessageAnswer($message->id, $this->target->sessionId, 0));
        $bus->run(new AnswerMessage($message->id, 1));
        $bus->run(new RequireMessageAnswer($message->id, $this->target->sessionId, 1));

        $this->assertThrows(fn () => $bus->run(new AnswerMessage($message->id, 1)), MessageRoundStale::class);
        $this->assertSame(MessageState::WaitingForAnswer, $message->fresh()?->state);
    }
}
