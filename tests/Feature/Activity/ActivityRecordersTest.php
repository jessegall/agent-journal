<?php

declare(strict_types=1);

namespace Tests\Feature\Activity;

use App\Commands\Messages\AskChatQuestion\AskChatQuestionCommand;
use App\Commands\Messages\ReplyToMessage\ReplyToMessageCommand;
use App\Enums\ActivityLevel;
use App\Enums\ActivityType;
use App\Enums\ToolOutcome;
use App\Events\Hooks\HelperReportedOnRecord;
use App\Events\Hooks\ToolCallFinished;
use App\Events\Messages\ChatMessageAccepted;
use App\Events\Sessions\ActivityRecorded;
use App\Events\Sessions\StartAccepted;
use App\Models\Agents\ActivityEntry;
use App\Support\ActorIdentity;
use App\Support\Inputs\Values\DriverToolInput;
use App\Support\Inputs\Values\ToolResult;
use App\Support\RecordIdentity;
use App\Values\StackTarget;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use Tests\Support\MessagingTestCase;
use Tests\Support\OpensPairChats;
use Tests\Support\ShowsMessageBatches;

/**
 * What agents read, ran, edited, started and posted becomes one activity entry each, at its type's level, and tells
 * open pages once; a command with a secret keeps no value and messages between agents alone are not recorded.
 */
final class ActivityRecordersTest extends MessagingTestCase
{
    use OpensPairChats;
    use ShowsMessageBatches;

    protected const array TABLES = [...parent::TABLES, 'activity_entries', 'conversations', 'direct_chats'];

    public function test_a_finished_read_command_and_edit_are_each_one_entry_and_tell_open_pages(): void
    {
        Event::fake([ActivityRecorded::class]);

        $this->finish('Read', ['file_path' => 'src/main.go']);
        $this->finish('Bash', ['command' => 'go test ./...']);
        $this->finish('Edit', ['file_path' => 'src/main.go', 'old_string' => 'a', 'new_string' => 'b']);
        $this->finish('TodoWrite', ['todos' => []]);

        $this->assertSame(
            [['read', 'src/main.go', 1], ['ran', 'go test ./...', 2], ['edited', 'src/main.go', 2]],
            $this->entries(),
        );
        Event::assertDispatchedTimes(ActivityRecorded::class, 3);
    }

    public function test_a_command_with_a_secret_keeps_only_its_first_word(): void
    {
        $this->finish('Bash', ['command' => 'curl -H "Authorization: Bearer abc123" https://example.test']);

        $this->assertSame([['ran', 'curl with a private value', 2]], $this->entries());
    }

    public function test_a_helper_start_and_its_report_are_entries_of_the_agent_that_started_it(): void
    {
        $events = $this->app->make(Dispatcher::class);
        $events->dispatch(new StartAccepted('request', $this->reviewer->agent_id, $this->reviewer->id, null, $this->builder->agent_id));
        $events->dispatch(new StartAccepted('request', $this->builder->agent_id, $this->builder->id));
        $events->dispatch(new HelperReportedOnRecord(new RecordIdentity('tasks.task-run', (string) Str::ulid()), $this->reviewer->agent_id));

        $this->assertSame([['helper_started', 'Reviewer', 2], ['helper_finished', 'Reviewer', 2]], $this->entries());
        $this->assertSame(
            $this->builder->agent_id,
            ActivityEntry::query()->where('type', ActivityType::HelperStarted->value)->firstOrFail()->actor()->id,
        );
    }

    public function test_an_agents_post_in_a_chat_with_a_user_is_an_entry_and_one_between_agents_is_not(): void
    {
        $withOwner = $this->pairChat(ActorIdentity::of($this->owner), $this->actorOf($this->builder));
        $betweenAgents = $this->pairChat($this->actorOf($this->reviewer), $this->actorOf($this->builder));
        $questionId = $this->runOnBus(new AskChatQuestionCommand($withOwner->inbox_id, 'Ready?', 'ask-key'));

        $this->asAgent($this->builder);
        $this->runOnBus($this->claimSpeech($withOwner->inbox_id, $questionId));
        $replyId = $this->runOnBus(new ReplyToMessageCommand($questionId, null, 'The tests pass.'));
        $this->app->make(Dispatcher::class)->dispatch(
            new ChatMessageAccepted($replyId, $this->actorOf($this->builder), $betweenAgents->inbox_id),
        );

        $this->assertSame([['posted', 'The tests pass.', ActivityLevel::Notable->value]], $this->entries());
    }

    /**
     * @param  array<string, mixed>  $arguments
     */
    private function finish(string $toolName, array $arguments): void
    {
        $this->app->make(Dispatcher::class)->dispatch(new ToolCallFinished(
            new StackTarget($this->builder->agent_id, $this->builder->id),
            new ToolResult($toolName, ToolOutcome::Succeeded, new DriverToolInput($arguments)),
        ));
    }

    /**
     * @return list<array{string, string, int}>
     */
    private function entries(): array
    {
        return ActivityEntry::query()->orderBy('id')->get()->map(
            fn (ActivityEntry $entry) => [$entry->type->value, $entry->subject, $entry->level->value],
        )->values()->all();
    }
}
