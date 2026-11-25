<?php

declare(strict_types=1);

namespace Domain\Sequences\Tests\Commands;

use Domain\Sequences\Commands\DefineSequence\DefineSequenceCommand;
use Domain\Sequences\Events\SequenceDefined;
use Domain\Sequences\Models\Sequence;
use Domain\Sequences\Tests\TestCase;
use Domain\Sequences\Values\SequenceStep;
use Illuminate\Support\Facades\Event;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;

/**
 * A user defines a sequence: it keeps its name and steps at its first version and says it was defined.
 */
#[TestsCommand(DefineSequenceCommand::class)]
final class DefineSequenceTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_defined_sequence_keeps_its_steps_at_its_first_version_and_says_so(): void
    {
        Event::fake([SequenceDefined::class]);
        $this->journal->owner();

        $sequenceId = $this->journal->run(new DefineSequenceCommand('Release', [self::step('tests')]));

        $sequence = Sequence::query()->findOrFail($sequenceId);
        $this->assertSame([
            'Release',
            1,
        ], [
            $sequence->name,
            $sequence->version,
        ]);
        $this->assertEquals([self::step('tests')->toArray()], $sequence->steps->toArray());
        Event::assertDispatched(SequenceDefined::class, fn (SequenceDefined $event) => $event->sequenceId === $sequenceId);
    }

    private static function step(string $id): SequenceStep
    {
        return new SequenceStep(id: $id, title: ucfirst($id), runsWhen: 'held', doneWhen: 'green');
    }
}
