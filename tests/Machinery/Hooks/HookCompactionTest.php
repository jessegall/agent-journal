<?php

declare(strict_types=1);

namespace Tests\Machinery\Hooks;

use App\Agents\Drivers\Capabilities\DriverCapabilities;
use App\Agents\Drivers\Enums\RewriteSupport;
use App\Agents\Inputs\Values\CompactionDetails;
use App\Bus\Contracts\CommandBus;
use App\Support\Inputs\ContextCompacted;
use Domain\Memory\MemoryDomain;
use Domain\Memory\Models\Memory;
use Domain\Rules\Models\Rule;
use Domain\Rules\RulesDomain;
use Domain\Rules\Tests\Fixtures\RuleFixtures;
use Domain\Sequences\Commands\StartSequence\StartSequenceCommand;
use Domain\Sequences\Models\SequenceRun;
use Domain\Sequences\SequencesDomain;
use Domain\Sequences\Support\States\FollowSequenceState;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Tests\Support\CommittedHookStack;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\TestActors;
use Tests\Support\TestText;
use Tests\TestCase;

#[TestsMachinery(ContextCompacted::class)]
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
        return DomainBoot::withRequirements(
            MemoryDomain::class,
            RulesDomain::class,
            SequencesDomain::class,
            TasksDomain::class,
        );
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
        $rules = $this->journal->user('Proposer')->user('Approver')->fixtures(RuleFixtures::class)
            ->holdingRule('Holding rule', self::RULE_TEXT, 'Proposer', 'Approver')
            ->holdingRule('Old rule', 'An old rule.', 'Proposer', 'Approver');
        $rules->ruleCalled('Old rule')->remove();
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
            TestText::words(
                new FollowSequenceState($this->run->id, $this->run->number, $this->run->steps)->instruction()->get(),
            ),
            $context,
        );
    }

    public function test_a_compaction_finishes_no_work(): void
    {
        $this->compact('call-1');

        $this->assertSame(TaskStatus::Started, $this->task->fresh()?->status);
        $this->assertSame(1, $this->run->fresh()?->current_step);
        $this->assertSame(['core.ready', 'tasks.work', 'sequences.follow'], $this->storedTypeKeys());
    }

    /**
     * The reply to a compaction, which carries the answer's context as JSON.
     */
    private function compact(string $callId): string
    {
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

        return (string) json_encode($this->journal->answerHook($this->target, $compaction, $capabilities)->context);
    }

    private function remember(string $text, int $weight): void
    {
        Memory::create(TestActors::agentIdentity(1), $text, $weight);
    }
}
