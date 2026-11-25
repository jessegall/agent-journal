<?php

declare(strict_types=1);

namespace Domain\Memory\Tests\Feature;

use App\Exceptions\RecordUnavailable;
use App\Models\Access\User;
use App\Support\Access\AccessSettings;
use App\Support\ActorIdentity;
use Domain\Memory\Contracts\MemoryResolver;
use Domain\Memory\Models\Memory;
use Domain\Memory\Tests\TestCase;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\SendsSignedPayloads;
use Tests\Support\StartsAgentRequests;

/**
 * An agent keeps, changes, removes and lists its own memories through the four console commands and their signed
 * routes; a repeated request key keeps one memory, and another agent can neither change, remove nor list it.
 */
final class MemoryCommandsTest extends TestCase
{
    use CommitsHookRows;
    use SendsSignedPayloads;
    use StartsAgentRequests;

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
        $this->runCommandsAs($this->owner);

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

        $this->assertSame([
            'Better words.',
            9,
            2,
        ], [
            $memory->refresh()->text,
            $memory->weight,
            $memory->revision,
        ]);

        $this->artisan('memory:remove', ['memory' => $memory->id])->assertExitCode(0);
        $this->assertSame(0, Memory::query()->ownedBy(ActorIdentity::of($this->owner->agent))->count());
    }

    public function test_another_agent_cannot_edit_remove_or_list_the_memory(): void
    {
        $this->runCommandsAs($this->owner);
        $this->artisan('memory:save', ['text' => self::MEMORY_TEXT])->assertExitCode(0);
        $memory = Memory::query()->ownedBy(ActorIdentity::of($this->owner->agent))->sole();

        $ofAnotherActor = "Memory {$memory->id} does not exist or is not available to you.";
        $edit = ['memory_id' => $memory->id, 'revision' => 1, 'text' => 'Taken.', 'weight' => null];

        $this->signed($this->other, '/agent/memory/edit', [
            ...$edit,
            'request_key' => bin2hex(random_bytes(8)),
        ])
            ->assertJsonPath('message', $ofAnotherActor);

        $this->signed($this->other, '/agent/memory/remove', [
            'memory_id' => $memory->id,
            'request_key' => bin2hex(random_bytes(8)),
        ])->assertJsonPath('message', $ofAnotherActor);

        $this->signed($this->other, '/agent/memory/list', [])->assertJsonPath('memories', []);
        $this->assertSame(self::MEMORY_TEXT, $memory->refresh()->text);
    }

    public function test_a_blank_text_and_a_weight_above_ten_are_refused(): void
    {
        $this->runCommandsAs($this->owner);

        $this->artisan('memory:save', ['text' => ' '])->assertExitCode(1);
        $this->artisan('memory:save', [
            'text' => 'Heavy.',
            '--weight' => 11,
        ])->assertExitCode(1);

        $this->assertSame(0, Memory::query()->ownedBy(ActorIdentity::of($this->owner->agent))->count());
    }

    public function test_a_stale_edit_is_a_conflict_and_keeps_the_newer_text(): void
    {
        $this->runCommandsAs($this->owner);
        $this->artisan('memory:save', ['text' => 'Old words.'])->assertExitCode(0);
        $memory = Memory::query()->ownedBy(ActorIdentity::of($this->owner->agent))->sole();

        $this->artisan('memory:edit', [
            'memory' => $memory->id,
            '--revision' => 1,
            '--text' => 'Newer words.',
        ])
            ->assertExitCode(0);

        $this->artisan('memory:edit', [
            'memory' => $memory->id,
            '--revision' => 1,
            '--text' => 'Stale words.',
        ])
            ->expectsOutputToContain("Memory {$memory->id} is at revision 2, not 1")
            ->assertExitCode(1);

        $this->assertSame([
            'Newer words.',
            2,
        ], [
            $memory->refresh()->text,
            $memory->revision,
        ]);
    }

    public function test_reading_one_memory_gives_its_revision_and_another_agents_is_unavailable(): void
    {
        $this->startRequestAs($this->owner->agent->id, $this->owner->session->id);
        $memory = Memory::create(ActorIdentity::of($this->owner->agent), 'Read me.', 4);
        $resolver = $this->app->make(MemoryResolver::class);

        $this->assertSame(
            [
                'Read me.',
                1,
            ],
            [
                $resolver->memory($memory->id)->text,
                $resolver->memory($memory->id)->revision,
            ],
        );

        $this->app->forgetScopedInstances();
        $this->startRequestAs($this->other->agent->id, $this->other->session->id);

        $this->expectException(RecordUnavailable::class);

        $this->app->make(MemoryResolver::class)->memory($memory->id);
    }
}
