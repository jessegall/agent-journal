<?php

declare(strict_types=1);

namespace Domain\Memory\Tests\Commands;

use App\Exceptions\CommandInputInvalid;
use App\Support\ActorReference;
use Domain\Memory\Commands\SaveMemory\SaveMemoryCommand;
use Domain\Memory\Models\Memory;
use Domain\Memory\Tests\TestCase;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;

/**
 * An agent keeps a memory of its own with its text and weight; the same request sent again keeps one memory, and a
 * blank text or a weight outside one to ten is refused naming the field and keeps nothing.
 */
#[TestsCommand(SaveMemoryCommand::class)]
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

    private const string MEMORY_TEXT = 'Mine alone.';

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
            Memory::query()->ownedBy(ActorReference::of($this->journal->agentCalled('Keeper')))->sole()->id,
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
}
