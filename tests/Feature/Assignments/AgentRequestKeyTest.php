<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\TestCase;

/**
 * The agent CLI keys every write with a request_key inside its signed body, so a retry with the same key answers from
 * the receipt instead of changing the work again; keys belong to one session.
 */
final class AgentRequestKeyTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'session_tokens',
        'tasks',
        'assignments',
        'command_receipts',
        'number_groups',
        'inboxes',
        'inbox_members',
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

        $owner = $this->journal->owner()->ownerUser();
        $this->main = TestStart::start('main-agent');
        $this->helper = TestStart::start('read-only-helper');
        $this->task = $this->tasks()->task('Keyed work')->taskCalled('Keyed work');
    }

    public function test_a_failed_cli_write_prints_its_request_key_to_retry_with(): void
    {
        $this->journal->relayAgentCommands($this->helper);

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

    private function tasks(): TaskFixtures
    {
        return $this->journal->fixtures(TaskFixtures::class);
    }
}
