<?php

declare(strict_types=1);

namespace Domain\Sequences\Tests\Commands;

use Domain\Sequences\Commands\DefineSequence\DefineSequenceCommand;
use Domain\Sequences\Database\Seeders\SequencesSeeder;
use Domain\Sequences\Events\SequenceDefined;
use Domain\Sequences\Models\Sequence;
use Domain\Sequences\Tests\TestCase;
use Domain\Sequences\Values\SequenceStep;
use Illuminate\Support\Facades\Event;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestProjects;

/**
 * A user defines a sequence: it keeps its name and steps at its first version and says it was defined; a sequence of
 * one project is missing under another, and a Global one, as the seeded sequence is, shows under every project.
 */
#[TestsCommand(DefineSequenceCommand::class)]
final class DefineSequenceTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_defined_sequence_keeps_its_steps_at_its_first_version_and_says_so(): void
    {
        Event::fake([SequenceDefined::class]);
        $this->journal->owner();

        $sequenceId = $this->journal->run(
            new DefineSequenceCommand('Release', [self::step('tests')], TestProjects::localOwner()->key()),
        );

        $sequence = Sequence::query()->findOrFail($sequenceId);

        $this->assertSame(['Release', 1], [$sequence->name, $sequence->version]);

        $this->assertEquals([self::step('tests')->toArray()], $sequence->steps->toArray());

        Event::assertDispatched(
            SequenceDefined::class,
            fn (SequenceDefined $event) => $event->sequenceId === $sequenceId,
        );
    }

    public function test_a_sequence_of_one_project_is_missing_under_another(): void
    {
        $this->journal->owner()->project('A')->project('B');
        $projectA = $this->journal->projectCalled('A');

        $sequenceId = $this->journal->run(new DefineSequenceCommand('Release', [self::step('tests')], $projectA->id));

        $this->journal->selectProject('B');
        $this->assertFalse(Sequence::query()->whereKey($sequenceId)->exists());
        $this->journal->selectProject('A');
        $this->assertSame($projectA->id, Sequence::query()->findOrFail($sequenceId)->project_id);
    }

    public function test_the_seeded_sequence_is_global_and_shows_under_every_project(): void
    {
        $this->journal->owner()->project('A')->project('B');
        $this->seed(SequencesSeeder::class);

        $this->journal->selectProject('A');
        $seeded = Sequence::query()->sole();
        $this->journal->selectProject('B');

        $this->assertTrue($seeded->projectOwner()->isGlobal());
        $this->assertTrue(Sequence::query()->whereKey($seeded->id)->exists());
    }

    private static function step(string $id): SequenceStep
    {
        return new SequenceStep(id: $id, title: ucfirst($id), runsWhen: 'held', doneWhen: 'green');
    }
}
