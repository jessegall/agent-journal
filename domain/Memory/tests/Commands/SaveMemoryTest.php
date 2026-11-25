<?php

declare(strict_types=1);

namespace Domain\Memory\Tests\Commands;

use App\Exceptions\CommandInputInvalid;
use App\Models\Access\User;
use App\Support\Access\AccessSettings;
use App\Support\ActorIdentity;
use Domain\Memory\Commands\SaveMemory\SaveMemoryCommand;
use Domain\Memory\Models\Memory;
use Domain\Memory\Tests\TestCase;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;

/**
 * An agent keeps a memory of its own with its text and weight; the same request sent again keeps one memory, and a
 * blank text or a weight outside one to ten is refused naming the field and keeps nothing.
 */
final class SaveMemoryTest extends TestCase
{
    use CommitsHookRows;

    private const string REQUEST_KEY = '01JD8X0G9M3QZ6V4K2MEMORY01';

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'session_tokens',
        'memories',
        'number_groups',
        'command_receipts',
    ];

    private TestStart $other;

    private const string MEMORY_TEXT = 'Mine alone.';

    private TestStart $owner;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->agent('Keeper', 'read-only-helper')->actAs('Keeper');
    }

    public function test_a_saved_memory_keeps_its_text_and_weight_for_the_agent_that_saved_it(): void
    {
        $memoryId = $this->journal->run(new SaveMemoryCommand('Run migrate:fresh after a create-migration edit.', 7));

        $memory = Memory::query()->findOrFail($memoryId);
        $this->assertSame(
            ['Run migrate:fresh after a create-migration edit.', 7, 1],
            [$memory->text, $memory->weight, $memory->revision],
        );
        $this->assertSame(
            $memoryId,
            Memory::query()->ownedBy(ActorIdentity::of($this->journal->agentCalled('Keeper')))->sole()->id,
        );
    }

    public function test_the_same_request_sent_again_keeps_one_memory(): void
    {
        $first = $this->journal->run(new SaveMemoryCommand('Once.', 5), self::REQUEST_KEY);
        $second = $this->journal->run(new SaveMemoryCommand('Once.', 5), self::REQUEST_KEY);

        $this->assertSame($first, $second);
        $this->assertSame(1, Memory::query()->count());
    }

    public function test_a_blank_text_and_a_weight_outside_one_to_ten_are_refused_naming_the_field(): void
    {
        $this->assertThrows(
            fn () => $this->journal->run(new SaveMemoryCommand('   ', 5)),
            CommandInputInvalid::class,
            'text:',
        );
        $this->assertThrows(
            fn () => $this->journal->run(new SaveMemoryCommand('Light.', Memory::LIGHTEST - 1)),
            CommandInputInvalid::class,
            'weight:',
        );
        $this->assertThrows(
            fn () => $this->journal->run(new SaveMemoryCommand('Heavy.', Memory::HEAVIEST + 1)),
            CommandInputInvalid::class,
            'weight:',
        );

        $this->assertSame(0, Memory::query()->count());
    }

    public function test_the_lightest_and_the_heaviest_weight_are_kept_under_the_next_numbers(): void
    {
        $this->journal->run(new SaveMemoryCommand('Lightest.', Memory::LIGHTEST));
        $this->journal->run(new SaveMemoryCommand('Heaviest.', Memory::HEAVIEST));

        $this->assertSame([1, 2], Memory::query()->orderBy('number')->pluck('number')->all());
    }

    public function test_an_agent_saves_a_memory_and_reads_it_back(): void
    {
        $user = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($user->id));
        $this->owner = TestStart::start('read-only-helper');
        $this->other = TestStart::start('read-only-helper');

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
        $user = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($user->id));
        $this->owner = TestStart::start('read-only-helper');
        $this->other = TestStart::start('read-only-helper');

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
