<?php

declare(strict_types=1);

namespace Domain\Sequences\Tests\Commands;

use Domain\Sequences\Commands\ChangeSequence\ChangeSequenceCommand;
use Domain\Sequences\Exceptions\SequenceChangedMeanwhile;
use Domain\Sequences\Models\Sequence;
use Domain\Sequences\Tests\Fixtures\SequenceFixtures;
use Domain\Sequences\Tests\TestCase;
use Domain\Sequences\Values\SequenceStep;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;

/**
 * A user changes a sequence at the version they opened: it goes one version on and a run it already started keeps
 * its own steps; a change from an older version is refused and keeps the newer steps.
 */
#[TestsCommand(ChangeSequenceCommand::class)]
final class ChangeSequenceTest extends TestCase
{
    use RefreshHookDatabase;

    private Sequence $sequence;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();
        $this->sequence = Sequence::create('Release', 'Ship a version', [self::step('tests')]);
    }

    public function test_a_change_goes_one_version_on_and_a_started_run_keeps_its_own_steps(): void
    {
        $run = $this->journal->fixtures(SequenceFixtures::class)->run('Release', ['tests'])->runCalled('Release');
        $run->sequence()->associate($this->sequence)->save();

        $this->journal->run(
            new ChangeSequenceCommand($this->sequence->id, 1, 'Release', [
                self::step('tests'),
                self::step('merge'),
            ]),
        );

        $this->assertSame(2, $this->sequence->refresh()->version);
        $this->assertCount(2, $this->sequence->steps);
        $this->assertSame(['tests'], $run->refresh()->steps);
    }

    public function test_a_change_from_an_older_version_is_refused_and_keeps_the_newer_steps(): void
    {
        $this->journal->run(new ChangeSequenceCommand($this->sequence->id, 1, 'Release', [self::step('merge')]));

        $this->assertThrows(
            fn () => $this->journal->run(
                new ChangeSequenceCommand($this->sequence->id, 1, 'Release', [self::step('tests')]),
            ),
            SequenceChangedMeanwhile::class,
        );

        $this->assertSame([
            2,
            'merge',
        ], [
            $this->sequence->refresh()->version,
            $this->sequence->steps[0]->id,
        ]);
    }

    private static function step(string $id): SequenceStep
    {
        return new SequenceStep(id: $id, title: ucfirst($id), runsWhen: 'held', doneWhen: 'green');
    }
}
