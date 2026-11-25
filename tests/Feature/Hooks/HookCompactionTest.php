<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Contracts\Bus\CommandBus;
use App\Enums\Drivers\RewriteSupport;
use App\Events\Hooks\ContextStarted;
use App\Models\Drivers\HookCall;
use App\Support\Drivers\DriverCapabilities;
use App\Support\Drivers\DriverReply;
use App\Support\Inputs\ContextCompacted;
use App\Support\Inputs\Values\CompactionDetails;
use App\Support\OperationDeadline;
use App\Support\Stack\HookAnswer;
use Domain\Memory\MemoryDomain;
use Domain\Memory\Models\Memory;
use Domain\Rules\Models\Rule;
use Domain\Rules\RulesDomain;
use Domain\Sequences\Commands\StartSequence\StartSequenceCommand;
use Domain\Sequences\Models\SequenceRun;
use Domain\Sequences\SequencesDomain;
use Domain\Sequences\Support\States\FollowSequenceState;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Illuminate\Support\Facades\Event;
use Tests\Support\CommittedHookStack;
use Tests\Support\DomainBoot;
use Tests\Support\HoldingRules;
use Tests\Support\TestActors;
use Tests\Support\TestText;
use Tests\TestCase;

final class HookCompactionTest extends TestCase
{
    use CommittedHookStack;

    private const string RULE_TEXT = 'No phase waits on the user.';

    private const string RULE_REMINDER = 'Rule %s: %s';

    private const string MEMORY_TEXT = 'Use plain words.';

    private const string QUESTION_TEXT = 'Question 10 is still open.';

    private const string MEMORY_REMINDER = 'Memory: %s';

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(MemoryDomain::class, RulesDomain::class, SequencesDomain::class, TasksDomain::class);
    }

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

        $ruleNumber = Rule::query()->where('text', self::RULE_TEXT)->value('number');

        $this->assertContains(sprintf(self::RULE_REMINDER, $ruleNumber, self::RULE_TEXT), $context);
        $this->assertContains(sprintf(self::MEMORY_REMINDER, self::MEMORY_TEXT), $context);
        $this->assertContains(sprintf(self::MEMORY_REMINDER, self::QUESTION_TEXT), $context);
        $this->assertSame(
            [],
            array_values(array_filter($context, fn (string $line) => str_contains($line, 'An old rule.'))),
        );
        $this->assertContains(
            TestText::words(new FollowSequenceState($this->run->id, $this->run->number, $this->run->steps)->instruction()->get()),
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

        $this->assertSame(TaskStatus::Started, $this->task->fresh()?->status);
        $this->assertSame(1, $this->run->fresh()?->current_step);
        $this->assertSame(['core.ready', 'tasks.work', 'sequences.follow'], $this->storedTypeKeys());
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
        Memory::create(TestActors::agentIdentity(1), $text, $weight);
    }
}
