<?php

declare(strict_types=1);

namespace Domain\Sequences\Tests\Feature;

use Domain\Sequences\Commands\ChangeSequence\ChangeSequenceCommand;
use Domain\Sequences\Commands\ChangeSequence\ChangeSequenceHandler;
use Domain\Sequences\Data\SequenceStepData;
use Domain\Sequences\Events\SequenceChanged;
use Domain\Sequences\Events\SequenceDefined;
use Domain\Sequences\Exceptions\SequenceChangedMeanwhile;
use Domain\Sequences\Models\Sequence;
use Domain\Sequences\Models\SequenceRun;
use Domain\Sequences\Policies\StoredSequencePolicy;
use Domain\Sequences\Tests\TestCase;
use Illuminate\Support\Facades\Event;
use Tests\Support\RefreshHookDatabase;

/**
 * A stored sequence raises its fact when it is defined and when it changes, goes one version on with each change,
 * and leaves the steps of a run it already started alone; its policy guards the Sequence model.
 */
final class StoredSequenceTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_defining_stores_the_steps_and_raises_its_fact(): void
    {
        Event::fake([SequenceDefined::class]);

        $sequence = Sequence::define('Release', 'Ship a version', [self::step('tests')]);

        $this->assertSame(1, $sequence->fresh()?->version);
        $this->assertEquals([self::step('tests')], $sequence->fresh()?->stepList());
        Event::assertDispatched(
            SequenceDefined::class,
            fn (SequenceDefined $fact) => $fact->sequenceId === $sequence->id,
        );
    }

    public function test_a_change_goes_one_version_on_and_a_started_run_keeps_its_own_steps(): void
    {
        Event::fake([SequenceChanged::class]);
        $sequence = Sequence::define('Release', 'Ship a version', [self::step('tests')]);
        $run = SequenceRun::create('Release', ['tests']);
        $run->sequence()->associate($sequence)->save();

        $sequence->change('Release', 'Ship a version', [self::step('tests'), self::step('merge')]);

        $this->assertSame(2, $sequence->fresh()?->version);
        $this->assertSame(['tests'], $run->fresh()?->steps);
        Event::assertDispatched(
            SequenceChanged::class,
            fn (SequenceChanged $fact) => $fact->sequenceId === $sequence->id,
        );
    }

    public function test_a_change_from_an_older_version_is_refused(): void
    {
        $sequence = Sequence::define('Release', 'Ship a version', [self::step('tests')]);
        $sequence->change('Release', 'Ship a version', [self::step('merge')]);

        $this->expectException(SequenceChangedMeanwhile::class);

        $stale = new ChangeSequenceCommand($sequence->id, 1, 'Release', [self::step('tests')]);

        new ChangeSequenceHandler()->handle($stale);
    }

    public function test_the_policy_guards_the_stored_sequence(): void
    {
        $this->assertSame(Sequence::class, StoredSequencePolicy::model());
    }

    private static function step(string $id): SequenceStepData
    {
        return SequenceStepData::from([
            'id' => $id,
            'title' => ucfirst($id),
            'runsWhen' => 'held',
            'doneWhen' => 'green',
        ]);
    }
}
