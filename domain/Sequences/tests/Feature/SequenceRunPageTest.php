<?php

declare(strict_types=1);

namespace Domain\Sequences\Tests\Feature;

use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Sequences\Models\Sequence;
use Domain\Sequences\Models\SequenceRun;
use Domain\Sequences\Tests\TestCase;
use Domain\Sequences\Values\SequenceStep;
use Inertia\Testing\AssertableInertia;
use Tests\Support\RefreshHookDatabase;

/**
 * The Sequences page lists the stored sequences and a chosen one shows its steps and its runs; a run page opens only
 * for a run the reader may read, and every run is one a user may read.
 */
final class SequenceRunPageTest extends TestCase
{
    use RefreshHookDatabase;

    private const string READER = 'page.data.root.children.1.children.1.children';

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
    }

    public function test_the_index_lists_the_stored_sequences_and_a_chosen_one_shows_its_numbered_steps_and_no_runs(): void
    {
        $sequence = Sequence::create('Release', 'Ship a version', [
            new SequenceStep(...['id' => 'tests', 'title' => 'Tests', 'runsWhen' => 'held', 'doneWhen' => 'green']),
        ]);

        $run = SequenceRun::create('Release', ['Run the tests']);
        $run->sequence()->associate($sequence)->save();

        $this->actingAs($this->owner)->get('/sequences')->assertOk()->assertSee($sequence->id);

        $this->actingAs($this->owner)
            ->get("/sequences/{$sequence->id}")
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where(self::READER.'.3.rows.0.key', 'tests')
                ->where(self::READER.'.3.rows.0.leading.0.text', '1')
                ->missing(self::READER.'.4'));
    }

    public function test_a_sequence_without_a_summary_is_listed_by_its_name_alone(): void
    {
        $sequence = Sequence::create('Release', '', []);

        $this->actingAs($this->owner)->get("/sequences/{$sequence->id}")->assertOk();
    }

    public function test_an_unknown_sequence_is_not_found(): void
    {
        $this->actingAs($this->owner)->get('/sequences/01ARZ3NDEKTSV4RRFFQ69G5FAV')->assertNotFound();
    }

    public function test_a_run_nobody_follows_yet_opens_from_its_sequence(): void
    {
        $run = SequenceRun::create('Release', ['Read the brief.', 'Run the tests.']);

        $this->actingAs($this->owner)->get("/sequences/runs/{$run->number}")->assertOk();
    }

    public function test_an_unknown_run_is_not_found(): void
    {
        $this->actingAs($this->owner)->get('/sequences/runs/999')->assertNotFound();
    }
}
