<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Contracts\Assignments\AssignmentTransaction;
use App\Contracts\Assignments\AssignmentWriter;
use App\Enums\Assignments\AssignmentReason;
use App\Events\Assignments\AssignmentsChanged;
use App\Models\Agents\Agent;
use App\Models\Records\AssignmentRecord;
use App\Support\ActorIdentity;
use App\Support\AssigneeIdentity;
use App\Support\RecordIdentity;
use App\Support\Reflector;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Tasks\Models\Task;
use Exception;
use Illuminate\Database\DatabaseTransactionsManager;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use PDOException;
use RuntimeException;
use Tests\Support\AssignmentWriterInTransaction;
use Tests\Support\CommitsHookRows;
use Tests\Support\Exceptions\SimulatedFailure;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * The one committed fact of an assignment command: raised once after the commit with only real changes, never for a
 * no-op, a rollback or an attempt run again, and a failing listener cannot undo what was committed.
 */
final class AssignmentFactsTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;

    private const array TABLES = ['users', 'agents', 'tasks', 'assignments'];

    /**
     * @var list<AssignmentsChanged>
     */
    private array $facts = [];

    private User $owner;

    private AssigneeIdentity $helper;

    private RecordIdentity $task;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->helper = AssigneeIdentity::of(Agent::create('Helper', 'read-only-helper'));
        $this->task = Task::factory()->create(['title' => 'Write the reader'])->assignmentIdentity();
        $this->startUserRequestAs($this->owner->id);
        $this->useTheApplicationsTransactionManager();
        $this->app->make('events')->listen(AssignmentsChanged::class, function (AssignmentsChanged $fact): void {
            $this->facts[] = $fact;
        });
    }

    public function test_a_change_raises_one_fact_and_a_no_op_raises_none(): void
    {
        $this->writer()->assign($this->task, $this->helper);
        $this->writer()->assign($this->task, $this->helper);

        $this->assertCount(1, $this->facts);
        $this->assertSame(AssignmentReason::Assigned, $this->facts[0]->reason);
        $this->assertTrue($this->facts[0]->actor->isSameAs(ActorIdentity::of($this->owner)));
        $this->assertCount(1, $this->facts[0]->changes);
    }

    public function test_a_rolled_back_command_raises_nothing(): void
    {
        $this->assertThrows(fn () => $this->app->make(AssignmentTransaction::class)->run(function (): never {
            $this->writer()->assign($this->task, $this->helper);

            throw SimulatedFailure::of('The caller gave up.');
        }), RuntimeException::class);

        $this->assertSame([], $this->facts);
        $this->assertSame(0, AssignmentRecord::query()->count());
    }

    public function test_an_attempt_run_again_leaves_only_the_fact_of_the_attempt_that_committed(): void
    {
        $attempts = 0;
        $conflict = new PDOException('could not serialize access');
        Reflector::of(Exception::class)->property('code')->writeTo($conflict, '40001');

        $this->app->make(AssignmentTransaction::class)->run(function () use (&$attempts, $conflict): void {
            $attempts++;
            $this->writer()->assign($this->task, $this->helper);

            if ($attempts === 1) {
                throw new QueryException('pgsql', 'select 1', [], $conflict);
            }
        });

        $this->assertSame(2, $attempts);
        $this->assertCount(1, $this->facts);
    }

    public function test_a_failing_listener_cannot_undo_the_committed_assignment(): void
    {
        $this->app->make('events')->listen(
            AssignmentsChanged::class,
            fn () => throw SimulatedFailure::of('The listener broke.'),
        );

        $this->assertThrows(fn () => $this->writer()->assign($this->task, $this->helper), RuntimeException::class);

        $this->assertSame(1, AssignmentRecord::query()->count());
    }

    /**
     * The test base runs after-commit work at once because it treats the outer transaction as its own; the
     * application's manager waits for the real commit, which is what these facts depend on.
     */
    private function useTheApplicationsTransactionManager(): void
    {
        $manager = new DatabaseTransactionsManager();
        $this->app->instance('db.transactions', $manager);
        DB::connection()->setTransactionManager($manager);
    }

    private function writer(): AssignmentWriter
    {
        return $this->app->make(AssignmentWriterInTransaction::class);
    }
}
