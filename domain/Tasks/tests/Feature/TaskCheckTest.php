<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\JournalCommands;
use App\Bus\Enums\CommandEntry;
use App\Processes\Contracts\ProcessRunCallers;
use App\Processes\Contracts\ResultReceipts;
use App\Processes\Enums\AssessmentOutcome;
use App\Processes\Values\PublishedResult;
use Carbon\CarbonImmutable;
use Domain\Tasks\Api\Events\TaskCheckRecorded;
use Domain\Tasks\Api\TaskProof;
use Domain\Tasks\Commands\BindTaskCheck;
use Domain\Tasks\Commands\RunTaskCheck;
use Domain\Tasks\Commands\StartTask;
use Domain\Tasks\Contracts\TaskProofResolver;
use Domain\Tasks\Exceptions\TaskCheckRefused;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskCheck;
use Domain\Tasks\Tests\TestCase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;
use Tests\Support\ActsAsOwner;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestIds;

/**
 * A worker makes a process run it opened a check of its current task run; the run's published result is bound to
 * that check once, and becomes the task's proof. A run of another caller is refused, and a receipt of a run no check
 * names binds nothing.
 */
final class TaskCheckTest extends TestCase
{
    use ActsAsOwner;
    use CommitsHookRows;
    use StartsAgentRequests;

    private const array TABLES = [
        'users',
        'tasks',
        'task_runs',
        'task_history',
        'task_checks',
        'agents',
        'agent_sessions',
        'agent_stacks',
        'assignments',
        'claim_authorizations',
        'command_receipts',
    ];

    public function test_a_check_of_the_current_run_binds_its_receipt_once_and_shows_as_a_proof(): void
    {
        Event::fake([TaskCheckRecorded::class]);
        $task = Task::factory()->create();
        $mine = (string) Str::ulid();
        $theirs = (string) Str::ulid();
        $this->callersAre([
            $mine => ActorIdentity::of($this->owner),
            $theirs => new ActorIdentity(ActorType::User, TestIds::of(9)),
        ]);
        $this->startUserRequestAs($this->owner->id);
        $this->runCommand(new StartTask($task->id));

        $this->runCommand(new RunTaskCheck($task->id, 1, $mine, 'acme verify'));
        $this->assertThrows(
            fn () => $this->runCommand(new RunTaskCheck($task->id, 1, $theirs, 'acme verify')),
            TaskCheckRefused::class,
        );
        $this->assertThrows(
            fn () => $this->runCommand(new RunTaskCheck($task->id, 1, $mine, 'acme verify')),
            TaskCheckRefused::class,
        );

        $this->receiptsAre([
            'receipt-mine' => self::passed('receipt-mine', $mine),
            'receipt-loose' => self::passed('receipt-loose', (string) Str::ulid()),
        ]);
        $this->bind('receipt-mine');
        $this->bind('receipt-mine');
        $this->bind('receipt-loose');

        $check = TaskCheck::query()->where('task_id', $task->id)->sole();
        $this->assertSame(['receipt-mine', 'passed', 1], [$check->result_receipt_id, $check->outcome, $check->run_number]);
        Event::assertDispatchedTimes(TaskCheckRecorded::class, 1);

        $proofs = $this->app->make(TaskProofResolver::class)->proofsOf($task->id, null, 10)->proofs;
        $this->assertSame(
            [['acme verify', 'passed', 1]],
            array_map(fn (TaskProof $proof) => [$proof->operation, $proof->outcome, $proof->runNumber], $proofs),
        );
    }

    private static function passed(string $receiptId, string $runId): PublishedResult
    {
        return new PublishedResult($receiptId, $runId, 'acme verify', AssessmentOutcome::Passed, CarbonImmutable::now());
    }

    private function bind(string $receiptId): void
    {
        $this->app->make(JournalCommands::class)->runAsJournal(
            CommandEntry::Application,
            'task checks',
            new BindTaskCheck($receiptId),
        );
    }

    /**
     * @param  array<string, ActorIdentity>  $callers
     */
    private function callersAre(array $callers): void
    {
        $this->app->instance(ProcessRunCallers::class, new readonly class($callers) implements ProcessRunCallers
        {
            /**
             * @param  array<string, ActorIdentity>  $callers
             */
            public function __construct(private array $callers) {}

            public function callerOf(string $runId): Option
            {
                return isset($this->callers[$runId]) ? Some::create($this->callers[$runId]) : None::create();
            }
        });
    }

    /**
     * @param  array<string, PublishedResult>  $receipts
     */
    private function receiptsAre(array $receipts): void
    {
        $this->app->instance(ResultReceipts::class, new readonly class($receipts) implements ResultReceipts
        {
            /**
             * @param  array<string, PublishedResult>  $receipts
             */
            public function __construct(private array $receipts) {}

            public function find(string $receiptId): Option
            {
                return isset($this->receipts[$receiptId]) ? Some::create($this->receipts[$receiptId]) : None::create();
            }

            public function forPart(string $runId): Option
            {
                return None::create();
            }
        });
    }

    private function runCommand(object $command): void
    {
        $this->app->make(CommandBus::class)->run($command);
    }
}
