<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Models\Access\User;
use App\Models\Records\AssignmentRecord;
use App\Support\Access\AccessSettings;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Illuminate\Database\ConnectionInterface;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\SendsSignedPayloads;
use Tests\TestCase;

/**
 * The agent CLI keys every write with a request_key inside its signed body, so a retry with the same key answers from
 * the receipt instead of changing the work again; keys belong to one session.
 */
final class AgentRequestKeyTest extends TestCase
{
    use CommitsHookRows;
    use SendsSignedPayloads;

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'session_tokens',
        'tasks',
        'assignments',
        'command_receipts',
    ];

    private const string KEY = '01JD8X0G9M3QZ6V4K2CLIKEY001';

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    private TestStart $main;

    private TestStart $helper;

    private Task $task;

    protected function setUp(): void
    {
        parent::setUp();

        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->main = TestStart::start('main-agent');
        $this->helper = TestStart::start('read-only-helper');
        $this->task = Task::factory()->create(['title' => 'Keyed work']);
    }

    public function test_a_failed_cli_write_prints_its_request_key_to_retry_with(): void
    {
        $this->runCommandsAs($this->helper);

        $this->artisan(
            'assignment:assign',
            [
                'type' => 'tasks.task',
                'id' => $this->task->id,
                '--to' => "agent:{$this->main->agent->id}",
                '--request-key' => self::KEY,
            ],
        )
            ->expectsOutputToContain('--request-key='.self::KEY)
            ->assertExitCode(1);
    }

    public function test_one_key_from_two_agents_keys_two_separate_writes(): void
    {
        $second = TestStart::start('main-agent');
        $other = Task::factory()->create(['title' => 'Other work']);

        $this->signed(
            $this->main,
            '/agent/assignments/assign',
            [
                'record_type' => 'tasks.task',
                'record_id' => $this->task->id,
                'recipient_type' => 'agent',
                'recipient_id' => $this->helper->agent->id,
                'request_key' => self::KEY,
            ],
        )->assertOk();
        $this->signed(
            $second,
            '/agent/assignments/assign',
            [
                'record_type' => 'tasks.task',
                'record_id' => $other->id,
                'recipient_type' => 'agent',
                'recipient_id' => $this->helper->agent->id,
                'request_key' => self::KEY,
            ],
        )->assertOk();

        $authors = $this->app->make(
            ConnectionInterface::class,
        )->table('command_receipts')->where('request_key', self::KEY)->pluck('author_id')->all();
        $this->assertEqualsCanonicalizing([$this->main->agent->id, $second->agent->id], $authors);
        $this->assertSame(2, AssignmentRecord::query()->withoutGlobalScopes()->count());
    }

    public function test_a_malformed_request_key_is_refused(): void
    {
        $this->signed(
            $this->main,
            '/agent/assignments/assign',
            [
                'record_type' => 'tasks.task',
                'record_id' => $this->task->id,
                'recipient_type' => 'agent',
                'recipient_id' => $this->helper->agent->id,
                'request_key' => 'not a key!',
            ],
        )
            ->assertUnprocessable();
    }
}
