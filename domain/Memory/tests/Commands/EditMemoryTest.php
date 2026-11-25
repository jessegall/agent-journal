<?php

declare(strict_types=1);

namespace Domain\Memory\Tests\Commands;

use App\Exceptions\CommandInputInvalid;
use App\Exceptions\RecordUnavailable;
use App\Support\ActorIdentity;
use Domain\Memory\Commands\EditMemory\EditMemoryCommand;
use Domain\Memory\Exceptions\MemoryRevisionChanged;
use Domain\Memory\Models\Memory;
use Domain\Memory\Tests\TestCase;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Seeding\SeedsJournal;

/**
 * An agent changes the text or weight of its own memory at the revision it read, which moves it on one revision; a
 * stale revision is a conflict that keeps the newer text, a blank text or nothing to change is refused, and another
 * agent's memory is not there for it.
 */
final class EditMemoryTest extends TestCase
{
    use RefreshHookDatabase;
    use SeedsJournal;

    private Memory $memory;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal()->owner()
            ->agent('Keeper', 'read-only-helper')
            ->agent('Other', 'read-only-helper')
            ->actAs('Keeper');
        $this->memory = Memory::create(ActorIdentity::of($this->journal()->agentCalled('Keeper')), 'First words.', 4);
    }

    public function test_an_edit_changes_the_text_and_weight_and_moves_the_revision_on(): void
    {
        $this->journal()->run(new EditMemoryCommand($this->memory->id, 1, 'Better words.', 9));

        $this->assertSame(
            ['Better words.', 9, 2],
            [$this->memory->refresh()->text, $this->memory->weight, $this->memory->revision],
        );
    }

    public function test_an_edit_at_a_stale_revision_is_a_conflict_and_keeps_the_newer_text(): void
    {
        $this->journal()->run(new EditMemoryCommand($this->memory->id, 1, 'Newer words.', null));

        $this->assertThrows(
            fn () => $this->journal()->run(new EditMemoryCommand($this->memory->id, 1, 'Stale words.', null)),
            MemoryRevisionChanged::class,
        );
        $this->assertSame(['Newer words.', 2], [$this->memory->refresh()->text, $this->memory->revision]);
    }

    public function test_a_blank_text_or_nothing_to_change_is_refused_and_keeps_the_revision(): void
    {
        $this->assertThrows(
            fn () => $this->journal()->run(new EditMemoryCommand($this->memory->id, 1, '   ', null)),
            CommandInputInvalid::class,
            'text:',
        );
        $this->assertThrows(
            fn () => $this->journal()->run(new EditMemoryCommand($this->memory->id, 1, null, null)),
            CommandInputInvalid::class,
            'text:',
        );

        $this->assertSame(['First words.', 1], [$this->memory->refresh()->text, $this->memory->revision]);
    }

    public function test_another_agents_memory_is_not_there_for_it_and_stays_as_it_was(): void
    {
        $this->journal()->actAs('Other');

        $this->assertThrows(
            fn () => $this->journal()->run(new EditMemoryCommand($this->memory->id, 1, 'Taken.', null)),
            RecordUnavailable::class,
        );
        $this->assertSame('First words.', $this->memory->refresh()->text);
    }
}
