<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Assignments\Models\AssignmentRecord;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Tasks\Models\Task;
use Illuminate\Database\ConnectionInterface;
use Tests\Fixtures\Agents\TestLaunch;
use Tests\Support\CommitsHookRows;
use Tests\Support\SendsSignedCalls;
use Tests\TestCase;

/**
 * The agent CLI keys every write with a request_key inside its signed body, so a retry with the same key answers from
 * the receipt instead of changing the work again; keys belong to one session.
 */
final class AgentRequestKeyTest extends TestCase
{
    use CommitsHookRows;
    use SendsSignedCalls;

    private const array TABLES = ['users', 'agents', 'agent_sessions', 'launch_credentials', 'tasks', 'assignments', 'command_receipts'];

    private const string KEY = '01JD8X0G9M3QZ6V4K2CLIKEY001';

    private TestLaunch $main;

    private TestLaunch $helper;

    private Task $task;

    protected function setUp(): void
    {
        parent::setUp();

        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->main = TestLaunch::start('main-agent');
        $this->helper = TestLaunch::start('read-only-helper');
        $this->task = Task::factory()->create(['title' => 'Keyed work']);
    }

    public function test_a_cli_assign_retried_with_the_same_request_key_returns_the_stored_result_without_a_second_change(): void
    {
        $this->runCommandsAs($this->main);
        $arguments = ['type' => 'tasks.task', 'id' => $this->task->id, '--to' => "agent:{$this->helper->agent->id}", '--request-key' => self::KEY, '--json' => true];
        $this->artisan('assignment:assign', $arguments)->expectsOutputToContain('"changed":1')->assertExitCode(0);
        $reference = (string) $this->signed($this->main, '/agent/assignments/show', ['recordType' => 'tasks.task', 'recordId' => $this->task->id])->json('holder.reference');
        $this->signed($this->main, '/agent/assignments/unassign', ['recordType' => 'tasks.task', 'recordId' => $this->task->id, 'assignmentId' => $reference, 'holderType' => 'agent', 'holderId' => $this->helper->agent->id, 'request_key' => '01JD8X0G9M3QZ6V4K2CLIKEY002'])->assertOk();

        $this->artisan('assignment:assign', $arguments)->expectsOutputToContain('"changed":1')->assertExitCode(0);

        $this->assertSame(0, AssignmentRecord::query()->withoutGlobalScopes()->count());
    }

    public function test_a_failed_cli_write_prints_its_request_key_to_retry_with(): void
    {
        $this->runCommandsAs($this->helper);

        $this->artisan('assignment:assign', ['type' => 'tasks.task', 'id' => $this->task->id, '--to' => "agent:{$this->main->agent->id}", '--request-key' => self::KEY])
            ->expectsOutputToContain('--request-key='.self::KEY)
            ->assertExitCode(1);
    }

    public function test_one_key_from_two_agents_keys_two_separate_writes(): void
    {
        $second = TestLaunch::start('main-agent');
        $other = Task::factory()->create(['title' => 'Other work']);

        $this->signed($this->main, '/agent/assignments/assign', ['recordType' => 'tasks.task', 'recordId' => $this->task->id, 'recipientType' => 'agent', 'recipientId' => $this->helper->agent->id, 'request_key' => self::KEY])->assertOk();
        $this->signed($second, '/agent/assignments/assign', ['recordType' => 'tasks.task', 'recordId' => $other->id, 'recipientType' => 'agent', 'recipientId' => $this->helper->agent->id, 'request_key' => self::KEY])->assertOk();

        $authors = $this->app->make(ConnectionInterface::class)->table('command_receipts')->where('request_key', self::KEY)->pluck('author_id')->all();
        $this->assertEqualsCanonicalizing([$this->main->agent->id, $second->agent->id], $authors);
        $this->assertSame(2, AssignmentRecord::query()->withoutGlobalScopes()->count());
    }

    public function test_a_malformed_request_key_is_refused(): void
    {
        $this->signed($this->main, '/agent/assignments/assign', ['recordType' => 'tasks.task', 'recordId' => $this->task->id, 'recipientType' => 'agent', 'recipientId' => $this->helper->agent->id, 'request_key' => 'not a key!'])
            ->assertUnprocessable();
    }
}
