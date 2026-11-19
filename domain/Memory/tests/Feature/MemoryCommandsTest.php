<?php

declare(strict_types=1);

namespace Domain\Memory\Tests\Feature;

use App\Actors\Support\ActorIdentity;
use App\Bus\Contracts\CommandBus;
use App\Bus\Exceptions\CommandInputInvalid;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Memory\Commands\EditMemory;
use Domain\Memory\Commands\SaveMemory;
use Domain\Memory\Contracts\MemoryResolver;
use Domain\Memory\Exceptions\MemoryUnavailable;
use Domain\Memory\Models\Memory;
use Domain\Memory\Tests\TestCase;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\SendsSignedCalls;
use Tests\Support\StartsAgentRequests;

/**
 * An agent keeps, changes, removes and lists its own memories through the four console commands and their signed
 * routes; a repeated request key keeps one memory, and another agent can neither change, remove nor list it.
 */
final class MemoryCommandsTest extends TestCase
{
    use CommitsHookRows;
    use SendsSignedCalls;
    use StartsAgentRequests;

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'start_tokens',
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
        $this->runCommandsAs($this->owner);

        $this->artisan('memory:save', [
            'text' => 'Run migrate:fresh after a create-migration edit.',
            '--weight' => 7,
            '--json' => true,
        ])->assertExitCode(0);
        $memory = Memory::query()->ownedBy(ActorIdentity::of($this->owner->agent))->sole();

        $this->assertSame(['Run migrate:fresh after a create-migration edit.', 7], [$memory->text, $memory->weight]);
        $this->artisan('memory:list', ['--json' => true])
            ->expectsOutputToContain('"text":"Run migrate:fresh after a create-migration edit.","weight":7')
            ->assertExitCode(0);
    }

    public function test_the_same_request_key_keeps_one_memory(): void
    {
        $this->runCommandsAs($this->owner);

        $once = ['text' => 'Once.', '--request-key' => '01JD8X0G9M3QZ6V4K2MEMORY01'];
        $this->artisan('memory:save', $once)->assertExitCode(0);
        $this->artisan('memory:save', $once)->assertExitCode(0);

        $this->assertSame(1, Memory::query()->ownedBy(ActorIdentity::of($this->owner->agent))->count());
    }

    public function test_an_agent_edits_and_removes_its_own_memory(): void
    {
        $this->runCommandsAs($this->owner);
        $this->artisan('memory:save', ['text' => 'First words.'])->assertExitCode(0);
        $memory = Memory::query()->ownedBy(ActorIdentity::of($this->owner->agent))->sole();

        $this->artisan('memory:edit', [
            'memory' => $memory->id,
            '--revision' => 1,
            '--text' => 'Better words.',
            '--weight' => '9',
        ])->assertExitCode(0);
        $this->assertSame(['Better words.', 9, 2], [$memory->refresh()->text, $memory->weight, $memory->revision]);

        $this->artisan('memory:remove', ['memory' => $memory->id])->assertExitCode(0);
        $this->assertSame(0, Memory::query()->ownedBy(ActorIdentity::of($this->owner->agent))->count());
    }

    public function test_another_agent_cannot_edit_remove_or_list_the_memory(): void
    {
        $this->runCommandsAs($this->owner);
        $this->artisan('memory:save', ['text' => 'Mine alone.'])->assertExitCode(0);
        $memory = Memory::query()->ownedBy(ActorIdentity::of($this->owner->agent))->sole();

        $notYours = "Memory {$memory->id} is not one of yours.";
        $edit = ['memory_id' => $memory->id, 'revision' => 1, 'text' => 'Taken.', 'weight' => null];

        $this->signed($this->other, '/agent/memory/edit', [...$edit, 'request_key' => bin2hex(random_bytes(8))])
            ->assertJsonPath('message', $notYours);
        $this->signed($this->other, '/agent/memory/remove', [
            'memory_id' => $memory->id,
            'request_key' => bin2hex(random_bytes(8)),
        ])->assertJsonPath('message', $notYours);
        $this->signed($this->other, '/agent/memory/list', [])->assertJsonPath('memories', []);
        $this->assertSame('Mine alone.', $memory->refresh()->text);
    }

    public function test_a_blank_text_and_a_weight_above_ten_are_refused(): void
    {
        $this->runCommandsAs($this->owner);

        $this->artisan('memory:save', ['text' => ' '])->assertExitCode(1);
        $this->artisan('memory:save', ['text' => 'Heavy.', '--weight' => 11])->assertExitCode(1);

        $this->assertSame(0, Memory::query()->ownedBy(ActorIdentity::of($this->owner->agent))->count());
    }

    public function test_the_bus_refuses_a_blank_text_and_a_weight_outside_one_to_ten_naming_the_field(): void
    {
        $this->startRequestAs($this->owner->agent->id, $this->owner->session->id);
        $bus = $this->app->make(CommandBus::class);

        $this->assertThrows(fn () => $bus->run(new SaveMemory('   ', 5)), CommandInputInvalid::class, 'text:');
        $this->assertThrows(fn () => $bus->run(new SaveMemory('Light.', 0)), CommandInputInvalid::class, 'weight:');
        $this->assertThrows(fn () => $bus->run(new SaveMemory('Heavy.', 11)), CommandInputInvalid::class, 'weight:');
        $this->assertSame(0, Memory::query()->count());

        $bus->run(new SaveMemory('Lightest.', Memory::LIGHTEST));
        $bus->run(new SaveMemory('Heaviest.', Memory::HEAVIEST));

        $this->assertSame([1, 2], Memory::query()->orderBy('number')->pluck('number')->all());
    }

    public function test_an_edit_with_blank_text_or_nothing_to_change_is_refused_and_keeps_the_revision(): void
    {
        $this->startRequestAs($this->owner->agent->id, $this->owner->session->id);
        $memory = Memory::keep(ActorIdentity::of($this->owner->agent), 'Keep me.', 4);
        $bus = $this->app->make(CommandBus::class);

        $blank = new EditMemory($memory->id, 1, '   ', null);
        $nothing = new EditMemory($memory->id, 1, null, null);

        $this->assertThrows(fn () => $bus->run($blank), CommandInputInvalid::class, 'text:');
        $this->assertThrows(fn () => $bus->run($nothing), CommandInputInvalid::class, 'text:');
        $this->assertSame(['Keep me.', 1], [$memory->refresh()->text, $memory->revision]);
    }

    public function test_a_stale_edit_is_a_conflict_and_keeps_the_newer_text(): void
    {
        $this->runCommandsAs($this->owner);
        $this->artisan('memory:save', ['text' => 'Old words.'])->assertExitCode(0);
        $memory = Memory::query()->ownedBy(ActorIdentity::of($this->owner->agent))->sole();
        $this->artisan('memory:edit', ['memory' => $memory->id, '--revision' => 1, '--text' => 'Newer words.'])
            ->assertExitCode(0);

        $this->artisan('memory:edit', ['memory' => $memory->id, '--revision' => 1, '--text' => 'Stale words.'])
            ->expectsOutputToContain("Memory {$memory->id} is at revision 2, not 1")
            ->assertExitCode(1);

        $this->assertSame(['Newer words.', 2], [$memory->refresh()->text, $memory->revision]);
    }

    public function test_reading_one_memory_gives_its_revision_and_another_agents_is_unavailable(): void
    {
        $this->startRequestAs($this->owner->agent->id, $this->owner->session->id);
        $memory = Memory::keep(ActorIdentity::of($this->owner->agent), 'Read me.', 4);
        $resolver = $this->app->make(MemoryResolver::class);

        $this->assertSame(
            ['Read me.', 1],
            [$resolver->memory($memory->id)->text, $resolver->memory($memory->id)->revision],
        );

        $this->app->forgetScopedInstances();
        $this->startRequestAs($this->other->agent->id, $this->other->session->id);

        $this->expectException(MemoryUnavailable::class);

        $this->app->make(MemoryResolver::class)->memory($memory->id);
    }
}
