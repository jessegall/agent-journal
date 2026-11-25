<?php

declare(strict_types=1);

namespace Domain\Memory\Tests\Feature;

use App\Models\Access\User;
use App\Support\Access\AccessSettings;
use App\Support\ActorIdentity;
use Domain\Memory\Models\Memory;
use Domain\Memory\Tests\TestCase;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;

/**
 * An agent keeps, changes, removes and lists its own memories through the four console commands and their signed
 * routes; a repeated request key keeps one memory, and another agent can neither change, remove nor list it.
 */
final class MemoryCommandsTest extends TestCase
{
    use CommitsHookRows;

    private const string MEMORY_TEXT = 'Mine alone.';

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'session_tokens',
        'memories',
        'number_groups',
        'command_receipts',
    ];

    private TestStart $owner;

    private TestStart $other;

    protected function setUp(): void
    {
        parent::setUp();

        $user = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($user->id));
        $this->owner = TestStart::start('read-only-helper');
        $this->other = TestStart::start('read-only-helper');
    }

    public function test_an_agent_saves_a_memory_and_reads_it_back(): void
    {
        $this->journal->relayAgentCommands($this->owner);

        $this->artisan('memory:save', [
            'text' => 'Run migrate:fresh after a create-migration edit.',
            '--weight' => 7,
            '--json' => true,
        ])->assertExitCode(0);

        $memory = Memory::query()->ownedBy(ActorIdentity::of($this->owner->agent))->sole();

        $this->assertSame([
            'Run migrate:fresh after a create-migration edit.',
            7,
        ], [
            $memory->text,
            $memory->weight,
        ]);

        $this->artisan('memory:list', ['--json' => true])
            ->expectsOutputToContain('"text":"Run migrate:fresh after a create-migration edit.","weight":7')
            ->assertExitCode(0);
    }

    public function test_another_agent_cannot_edit_remove_or_list_the_memory(): void
    {
        $this->journal->relayAgentCommands($this->owner);
        $this->artisan('memory:save', ['text' => self::MEMORY_TEXT])->assertExitCode(0);
        $memory = Memory::query()->ownedBy(ActorIdentity::of($this->owner->agent))->sole();

        $ofAnotherActor = "Memory {$memory->id} does not exist or is not available to you.";
        $edit = ['memory_id' => $memory->id, 'revision' => 1, 'text' => 'Taken.', 'weight' => null];

        $this->journal->agentCall($this->other, 'POST', '/agent/memory/edit', [
            ...$edit,
            'request_key' => bin2hex(random_bytes(8)),
        ])
            ->assertJsonPath('message', $ofAnotherActor);

        $this->journal->agentCall($this->other, 'POST', '/agent/memory/remove', [
            'memory_id' => $memory->id,
            'request_key' => bin2hex(random_bytes(8)),
        ])->assertJsonPath('message', $ofAnotherActor);

        $this->journal->agentCall($this->other, 'POST', '/agent/memory/list', [])->assertJsonPath('memories', []);
        $this->assertSame(self::MEMORY_TEXT, $memory->refresh()->text);
    }
}
