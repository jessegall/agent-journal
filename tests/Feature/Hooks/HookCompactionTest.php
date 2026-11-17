<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Core\Hooks\Inputs\CompactionDetails;
use App\Core\Hooks\Inputs\ContextCompacted;
use App\Core\Hooks\Inputs\HookIdentity;
use App\Core\Hooks\Models\HookCall;
use App\Core\Hooks\OperationDeadline;
use App\Core\Hooks\Programs\ProgramCapabilities;
use App\Core\Hooks\Programs\ProgramReply;
use App\Core\Hooks\Programs\RewriteSupport;
use App\Core\Hooks\Stack\HookAnswer;
use App\Domain\Memory\Models\Memory;
use App\Domain\Rules\Models\Rule;
use App\Domain\Sequences\Models\SequenceRun;
use App\Domain\Sequences\StartSequence;
use App\Domain\Tasks\Models\Task;
use App\Domain\Tasks\StartTask;
use App\Domain\Tasks\TaskState;
use Illuminate\Support\Facades\DB;
use Tests\Support\CommittedHookStack;
use Tests\TestCase;

final class HookCompactionTest extends TestCase
{
    use CommittedHookStack;

    private Task $task;

    private SequenceRun $run;

    protected function setUp(): void
    {
        parent::setUp();

        $this->task = Task::query()->create(['title' => 'Write the walk']);
        $this->app->make(StartTask::class)->start($this->task, $this->target);
        $this->run = SequenceRun::query()->create(['name' => 'Close a task', 'steps' => ['Read the brief.', 'Run the phase tests.']]);
        $this->app->make(StartSequence::class)->start($this->run, $this->target);

        $this->remember('Use plain words.', 2);
        $this->remember('Question 10 is still open.', 1);
        Rule::query()->create(['text' => 'No phase waits on the user.']);
        Rule::query()->create(['text' => 'An old rule.'])->remove();
    }

    public function test_the_reminders_come_from_the_current_records_and_the_current_step(): void
    {
        $context = json_decode($this->compact('call-1'), true, flags: JSON_THROW_ON_ERROR);

        $this->assertContains('Rule '.Rule::query()->where('text', 'No phase waits on the user.')->value('id').': No phase waits on the user.', $context);
        $this->assertContains('Memory: Use plain words.', $context);
        $this->assertNotContains('Memory: Question 10 is still open.', $context);
        $this->assertSame([], array_values(array_filter($context, fn (string $line) => str_contains($line, 'An old rule.'))));
        $this->assertContains("Sequence run {$this->run->id} is on step 1: Read the brief.", $context);
    }

    public function test_a_repeated_callback_fades_the_memories_once_and_gets_the_same_reply(): void
    {
        $first = $this->compact('call-1');
        $retry = $this->compact('call-1');

        $this->assertSame($first, $retry);
        $this->assertSame([1], Memory::query()->pluck('weight')->all());
        $this->assertSame(1, HookCall::query()->count());
        $this->assertSame(1, DB::table('memory_compactions')->count());
    }

    public function test_a_second_compaction_fades_the_memories_again(): void
    {
        $this->compact('call-1');
        $this->compact('call-2');

        $this->assertSame(0, Memory::query()->count());
    }

    public function test_a_duplicate_found_under_the_lock_rolls_its_reaction_back(): void
    {
        $this->compact('call-1');
        DB::table('memory_compactions')->delete();
        $this->remember('Added after the first compaction.', 3);

        $this->compact('call-1');

        $this->assertSame(3, Memory::query()->where('text', 'Added after the first compaction.')->value('weight'));
        $this->assertSame(0, DB::table('memory_compactions')->count());
    }

    public function test_a_compaction_finishes_no_work(): void
    {
        $this->compact('call-1');

        $this->assertSame(TaskState::Started, $this->task->fresh()?->state);
        $this->assertSame(1, $this->run->fresh()?->current_step);
        $this->assertSame(['hooks.main_ready', 'tasks.working', 'sequences.following'], $this->storedTypeKeys());
    }

    /**
     * The reply to a compaction, which carries the answer's context as JSON.
     */
    private function compact(string $callId): string
    {
        $this->callAs($callId, hash('sha256', $callId));
        $compaction = new ContextCompacted(new HookIdentity(1, 10, $callId, hash('sha256', $callId)), new CompactionDetails($callId));
        $capabilities = new ProgramCapabilities('Test program', 'compaction context', ['onCompaction'], RewriteSupport::WithoutApproval);

        $reply = $this->machine()->answer($compaction, $capabilities, new OperationDeadline(3000), fn (HookAnswer $answer) => new ProgramReply((string) json_encode($answer->context), '', 0));

        return $reply->stdout;
    }

    private function remember(string $text, int $weight): void
    {
        (new Memory(['text' => $text, 'weight' => $weight]))->saveFor(1);
    }
}
