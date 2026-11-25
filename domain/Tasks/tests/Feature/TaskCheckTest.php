<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature;

use App\Contracts\Bus\CommandBus;
use App\Contracts\Bus\JournalCommands;
use App\Contracts\Bus\ResultReceipts;
use App\Contracts\Processes\ProcessRunCallers;
use App\Enums\ActorType;
use App\Enums\AssessmentOutcome;
use App\Enums\CommandEntry;
use App\Support\ActorIdentity;
use App\Values\PublishedResult;
use Carbon\CarbonImmutable;
use Domain\Tasks\Commands\BindTaskCheck\BindTaskCheckCommand;
use Domain\Tasks\Commands\RunTaskCheck\RunTaskCheckCommand;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Contracts\TaskProofResolver;
use Domain\Tasks\Events\TaskCheckRecorded;
use Domain\Tasks\Exceptions\TaskCheckRefused;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskCheck;
use Domain\Tasks\Tests\TestCase;
use Domain\Tasks\Values\TaskProof;
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
        $own = (string) Str::ulid();
        $other = (string) Str::ulid();

        $this->callersAre([
            $own => ActorIdentity::of($this->owner),
            $other => new ActorIdentity(ActorType::User, TestIds::of(9)),
        ]);

        $this->startUserRequestAs($this->owner->id);
        $this->runCommand(new StartTaskCommand($task->id));

        $this->runCommand(new RunTaskCheckCommand($task->id, 1, $own, 'acme verify'));

        $this->assertThrows(
            fn () => $this->runCommand(new RunTaskCheckCommand($task->id, 1, $other, 'acme verify')),
            TaskCheckRefused::class,
        );

        $this->assertThrows(
            fn () => $this->runCommand(new RunTaskCheckCommand($task->id, 1, $own, 'acme verify')),
            TaskCheckRefused::class,
        );

        $ownReceipt = strtolower((string) Str::ulid());
        $looseReceipt = strtolower((string) Str::ulid());

        $this->assertReceipts([
            $ownReceipt => self::passed($ownReceipt, $own),
            $looseReceipt => self::passed($looseReceipt, (string) Str::ulid()),
        ]);

        $this->bind($ownReceipt);
        $this->bind($ownReceipt);
        $this->bind($looseReceipt);

        $check = TaskCheck::query()->where('task_id', $task->id)->sole();

        $this->assertSame(
            [
                $ownReceipt,
                'passed',
                1,
            ],
            [
                $check->result_receipt_id,
                $check->outcome,
                $check->run_number,
            ],
        );

        Event::assertDispatchedTimes(TaskCheckRecorded::class, 1);

        $proofs = $this->app->make(TaskProofResolver::class)->proofsOf($task->id, null, 10)->proofs;

        $this->assertSame(
            [[
                'acme verify',
                'passed',
                1,
            ]],
            array_map(fn (TaskProof $proof) => [
                $proof->operation,
                $proof->outcome,
                $proof->runNumber,
            ], $proofs),
        );
    }

    private static function passed(string $receiptId, string $runId): PublishedResult
    {
        return new PublishedResult(
            $receiptId,
            $runId,
            'acme verify',
            AssessmentOutcome::Passed,
            CarbonImmutable::now(),
        );
    }

    private function bind(string $receiptId): void
    {
        $this->app->make(JournalCommands::class)->runAsJournal(
            CommandEntry::Application,
            'task checks',
            new BindTaskCheckCommand($receiptId),
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
                if (isset($this->callers[$runId])) {
                    return Some::create($this->callers[$runId]);
                }

                return None::create();
            }
        });
    }

    /**
     * @param  array<string, PublishedResult>  $receipts
     */
    private function assertReceipts(array $receipts): void
    {
        $this->app->instance(ResultReceipts::class, new readonly class($receipts) implements ResultReceipts
        {
            /**
             * @param  array<string, PublishedResult>  $receipts
             */
            public function __construct(private array $receipts) {}

            public function find(string $receiptId): Option
            {
                if (isset($this->receipts[$receiptId])) {
                    return Some::create($this->receipts[$receiptId]);
                }

                return None::create();
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
