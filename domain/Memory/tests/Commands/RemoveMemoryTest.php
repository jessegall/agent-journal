<?php

declare(strict_types=1);

namespace Domain\Memory\Tests\Commands;

use App\Exceptions\RecordUnavailable;
use Domain\Memory\Commands\RemoveMemory\RemoveMemoryCommand;
use Domain\Memory\Models\Memory;
use Domain\Memory\Tests\Fixtures\MemoryFixtures;
use Domain\Memory\Tests\TestCase;
use Tests\Support\RefreshHookDatabase;

/**
 * An agent removes a memory of its own; another agent's memory is not there for it and stays.
 */
final class RemoveMemoryTest extends TestCase
{
    use RefreshHookDatabase;

    private Memory $memory;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()
            ->agent('Keeper', 'read-only-helper')
            ->agent('Other', 'read-only-helper')
            ->actAs('Keeper');

        $this->memory = $this->journal->fixtures(MemoryFixtures::class)
            ->memory('Note', 'Keeper', 'Forget me.', 4)
            ->memoryCalled('Note');
    }

    public function test_an_agent_removes_its_own_memory(): void
    {
        $removed = $this->journal->run(new RemoveMemoryCommand($this->memory->id));

        $this->assertSame($this->memory->id, $removed);
        $this->assertSame(0, Memory::query()->count());
    }

    public function test_another_agents_memory_is_not_there_for_it_and_stays(): void
    {
        $this->journal->actAs('Other');

        $this->assertThrows(
            fn () => $this->journal->run(new RemoveMemoryCommand($this->memory->id)),
            RecordUnavailable::class,
        );

        $this->journal->actAs('Keeper');
        $this->assertSame(1, Memory::query()->count());
    }
}
