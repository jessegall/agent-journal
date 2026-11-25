<?php

declare(strict_types=1);

namespace Domain\Sequences\Tests\Feature;

use App\Enums\Assignments\ActorType;
use App\Support\ActorIdentity;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Sequences\Models\SequenceRun;
use Domain\Sequences\Tests\TestCase;
use Illuminate\Support\Str;
use Tests\Support\RefreshHookDatabase;

/**
 * The runs list shows one actor's runs, newest first and numbered by page, for a user who may read every owner's runs;
 * a run opened from it stands beside the list it came from.
 */
final class SequenceRunsListTest extends TestCase
{
    use RefreshHookDatabase;

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
    }

    public function test_the_list_shows_the_chosen_actors_runs_newest_first_with_their_total(): void
    {
        $first = $this->agent();
        $second = $this->agent();
        $older = $this->runFor($first);
        $newer = $this->runFor($first);
        $other = $this->runFor($second);
        SequenceRun::create('Not started', ['Wait.']);

        $page = $this->pageOf('/sequences/runs?'.http_build_query(['actor' => $first->text()]));

        $this->assertStringContainsString($first->text(), $page);
        $this->assertStringContainsString($second->text(), $page);
        $this->assertLessThan(strpos($page, $older->id), strpos($page, $newer->id));
        $this->assertStringNotContainsString($other->id, $page);
        $this->assertStringContainsString('"key":"count","size":"normal","style":"muted","text":"2"', $page);
    }

    public function test_a_run_opened_from_the_list_stands_beside_it_and_goes_back_to_it(): void
    {
        $first = $this->agent();
        $running = $this->runFor($first);
        $cancelled = $this->runFor($first);
        $cancelled->cancel();
        $query = http_build_query([
            'actor' => $first->text(),
            'page' => 1,
        ]);

        $list = $this->pageOf("/sequences/runs?{$query}");
        $run = $this->pageOf("/sequences/runs/{$running->number}?{$query}");

        $this->assertStringContainsString("/sequences/runs/{$running->number}?{$query}", $list);
        $this->assertStringContainsString(ucfirst($cancelled->state->value), $list);
        $this->assertStringContainsString("/sequences/runs?{$query}", $run);
        $this->assertStringContainsString($cancelled->id, $run);
    }

    public function test_with_no_runs_followed_the_list_is_empty(): void
    {
        $page = $this->pageOf('/sequences/runs');

        $this->assertStringContainsString('"key":"count","size":"normal","style":"muted","text":"0"', $page);
    }

    public function test_a_malformed_actor_is_not_found(): void
    {
        $this->runFor($this->agent());

        $this->actingAs($this->owner)->get('/sequences/runs?actor=nobody')->assertNotFound();
    }

    public function test_the_sequences_page_shows_the_sequences_only_and_offers_no_runs_view(): void
    {
        $this->assertStringNotContainsString('"href":"/sequences/runs"', $this->pageOf('/sequences'));
    }

    private function pageOf(string $address): string
    {
        $page = $this->actingAs($this->owner)->get($address)->assertOk()->viewData('page');

        return (string) json_encode($page, JSON_UNESCAPED_SLASHES);
    }

    private function agent(): ActorIdentity
    {
        return new ActorIdentity(ActorType::Agent, strtolower((string) Str::ulid()));
    }

    private function runFor(ActorIdentity $follower): SequenceRun
    {
        $run = SequenceRun::create('Release', [
            'Read the brief.',
            'Run the tests.',
        ]);
        $run->startFor($follower, (string) Str::uuid());

        return $run;
    }
}
