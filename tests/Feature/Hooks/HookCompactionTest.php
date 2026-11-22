<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Bus\Contracts\CommandBus;
use App\Bus\Support\OperationDeadline;
use App\Hooks\Drivers\DriverCapabilities;
use App\Hooks\Drivers\DriverReply;
use App\Hooks\Enums\RewriteSupport;
use App\Hooks\Events\ContextStarted;
use App\Hooks\Inputs\ContextCompacted;
use App\Hooks\Inputs\Values\CompactionDetails;
use App\Hooks\Models\HookCall;
use App\Hooks\Stack\HookAnswer;
use Domain\Memory\Models\Memory;
use Domain\Rules\Models\Rule;
use Domain\Sequences\Commands\StartSequence\StartSequenceCommand;
use Domain\Sequences\Enums\SequenceRunState;
use Domain\Sequences\Models\SequenceRun;
use Domain\Sequences\Support\SequenceWork;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Models\Task;
use Illuminate\Support\Facades\Event;
use Tests\Support\CommittedHookStack;
use Tests\Support\HoldingRules;
use Tests\Support\TestActors;
use Tests\TestCase;

final class HookCompactionTest extends TestCase
{
    use CommittedHookStack;

    private const string RULE_TEXT = 'No phase waits on the user.';

    private const string RULE_REMINDER = 'Rule %s: %s';

    private const string MEMORY_TEXT = 'Use plain words.';

    private const string QUESTION_TEXT = 'Question 10 is still open.';

    private const string MEMORY_REMINDER = 'Memory: %s';

    private Task $task;

    private SequenceRun $run;

    protected function setUp(): void
    {
        parent::setUp();

        $this->task = Task::factory()->create(['title' => 'Write the walk']);
        $this->app->make(CommandBus::class)->run(new StartTaskCommand($this->task->id));
        $this->run = SequenceRun::create('Close a task', ['Read the brief.', 'Run the phase tests.']);
        $this->app->make(CommandBus::class)->run(new StartSequenceCommand($this->run->id, $this->target->sessionId));

        $this->remember(self::MEMORY_TEXT, 2);
        $this->remember(self::QUESTION_TEXT, 1);
        HoldingRules::create(self::RULE_TEXT);
        HoldingRules::create('An old rule.')->remove();
    }

    public function test_the_reminders_come_from_the_current_records_and_the_current_step(): void
    {
        $context = json_decode($this->compact('call-1'), true, flags: JSON_THROW_ON_ERROR);

        $ruleId = Rule::query()->where('text', self::RULE_TEXT)->value('id');

        $this->assertContains(sprintf(self::RULE_REMINDER, $ruleId, self::RULE_TEXT), $context);
        $this->assertContains(sprintf(self::MEMORY_REMINDER, self::MEMORY_TEXT), $context);
        $this->assertContains(sprintf(self::MEMORY_REMINDER, self::QUESTION_TEXT), $context);
        $this->assertSame(
            [],
            array_values(array_filter($context, fn (string $line) => str_contains($line, 'An old rule.'))),
        );
        $this->assertContains(
            new SequenceWork($this->run->number, 1, 'Read the brief.', SequenceRunState::Running)->currentInstruction(),
            $context,
        );
    }

    public function test_a_repeated_callback_gets_the_same_reply_and_keeps_every_memory_weight(): void
    {
        $first = $this->compact('call-1');
        $retry = $this->compact('call-1');

        $this->assertSame($first, $retry);
        $this->assertEqualsCanonicalizing([2, 1], Memory::query()->pluck('weight')->all());
        $this->assertSame(1, HookCall::query()->count());
    }

    public function test_a_second_compaction_keeps_the_memories(): void
    {
        $this->compact('call-1');
        $this->compact('call-2');

        $this->assertEqualsCanonicalizing([2, 1], Memory::query()->pluck('weight')->all());
    }

    public function test_a_compaction_finishes_no_work(): void
    {
        $this->compact('call-1');

        $this->assertSame(TaskState::Started, $this->task->fresh()?->state);
        $this->assertSame(1, $this->run->fresh()?->current_step);
        $this->assertSame(['hooks.ready', 'tasks.working', 'sequences.following'], $this->storedTypeKeys());
    }

    public function test_a_replayed_compaction_runs_no_reminder_listener(): void
    {
        $this->compact('call-1');
        $received = 0;
        Event::listen(ContextStarted::class, function () use (&$received): void {
            $received++;
        });

        $this->compact('call-1');

        $this->assertSame(0, $received);
    }

    /**
     * The reply to a compaction, which carries the answer's context as JSON.
     */
    private function compact(string $callId): string
    {
        $this->callAs($callId, hash('sha256', $callId));
        $compaction = new ContextCompacted(
            TestActors::hookIdentity(1, 10, $callId, hash('sha256', $callId)),
            new CompactionDetails($callId),
        );
        $capabilities = new DriverCapabilities(
            'Test driver',
            'compaction context',
            ['onCompaction'],
            RewriteSupport::WithoutApproval,
        );

        $reply = $this->machine()->answer(
            $compaction,
            $capabilities,
            new OperationDeadline(3000),
            fn (HookAnswer $answer) => new DriverReply((string) json_encode($answer->context), '', 0),
        );

        return $reply->stdout;
    }

    private function remember(string $text, int $weight): void
    {
        new Memory(['text' => $text, 'weight' => $weight])->saveFor(TestActors::agentIdentity(1));
    }
}
