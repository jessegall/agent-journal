<?php

declare(strict_types=1);

namespace Domain\Memory\Tests\Fixtures;

use Domain\Memory\Commands\EditMemory\EditMemoryCommand;
use Domain\Memory\Exceptions\MemoryRevisionChanged;
use Domain\Memory\Tests\TestCase;
use Tests\Support\RefreshHookDatabase;

/**
 * A memory arranged through the journal keeps its text, weight and revision together: a stale edit conflicts and the
 * newer text survives.
 */
final class MemoryFixturesTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_stale_edit_conflicts_and_the_newer_text_and_its_revision_survive(): void
    {
        $memories = $this->journal->owner()->agent('Keeper', 'read-only-helper')->fixtures(MemoryFixtures::class)
            ->memory('Plan', 'Keeper', 'First words.', 4)
            ->assertRevision('Plan', revision: 1, weight: 4, text: 'First words.');
        $id = $memories->memoryCalled('Plan')->id;

        $this->journal->runAs('Keeper', new EditMemoryCommand($id, 1, 'Newer words.', 9));
        $this->journal->assertRefused(
            MemoryRevisionChanged::class,
            fn () => $this->journal->runAs('Keeper', new EditMemoryCommand($id, 1, 'Stale words.', null)),
        );

        $memories->assertRevision('Plan', revision: 2, weight: 9, text: 'Newer words.');
    }
}
