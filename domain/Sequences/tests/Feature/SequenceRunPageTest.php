<?php

declare(strict_types=1);

namespace Domain\Sequences\Tests\Feature;

use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Sequences\Models\SequenceRun;
use Domain\Sequences\Tests\TestCase;
use Inertia\Testing\AssertableInertia;
use Tests\Support\RefreshHookDatabase;

/**
 * The run page opens only for a run the reader may read, and the sequences address explains that runs open from their
 * own link, since no list of them exists.
 */
final class SequenceRunPageTest extends TestCase
{
    use RefreshHookDatabase;

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
    }

    public function test_the_index_address_explains_how_a_run_is_reached(): void
    {
        $this->actingAs($this->owner)->get('/sequences')->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
            ->component('layout/DeclaredLayout')
            ->where('page.data.root.children.1.key', 'entry')
            ->where('page.data.root.children.1.style', 'empty'));
    }

    public function test_a_run_the_reader_may_not_read_is_not_found(): void
    {
        $run = SequenceRun::create('Release', ['Read the brief.', 'Run the tests.']);

        $this->actingAs($this->owner)->get("/sequences/runs/{$run->number}")->assertNotFound();
    }
}
