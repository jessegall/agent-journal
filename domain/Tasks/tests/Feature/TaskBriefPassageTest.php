<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature;

use Tests\Support\TestIds;
use App\Enums\Search\ScoreTier;
use App\Enums\Search\SearchSurface;
use App\Models\Access\User;
use App\Support\Access\AccessSettings;
use App\Support\ActorContext;
use App\Values\SearchBatch;
use App\Values\SearchQuery;
use App\Values\SearchReader;
use App\Values\SearchResult;
use App\Values\SearchScope;
use App\Values\SearchWords;
use App\Values\SourcePosition;
use App\Values\WorkAllowance;
use Domain\Tasks\Exceptions\TaskPassageUnavailable;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Support\Mcp\TaskReadResult;
use Domain\Tasks\Support\TaskSearchAccess;
use Domain\Tasks\Support\TaskSearchProvider;
use Domain\Tasks\Tests\TestCase;
use Domain\Tasks\Values\TaskBriefPassage;
use Tests\Support\RefreshHookDatabase;

/**
 * A phrase only late in a long brief, across a segment edge, is found by the brief tier; its tasks_read action
 * opens the context at that passage on the first call, the inspector's Brief tab opens there too, and an edit that
 * takes the phrase away makes the passage unavailable.
 */
final class TaskBriefPassageTest extends TestCase
{
    use RefreshHookDatabase;

    private const string PHRASE = 'rotate the signing keys';

    private const string USER_ID = '01ARZ3NDEKTSV4RRFFQ69G5FAA';

    public function test_a_late_phrase_is_found_and_opens_at_its_passage(): void
    {
        $task = $this->taskWithLatePhrase();

        $hit = $this->briefHit();

        $this->assertSame($task->id, $hit->reference->id);
        $this->assertSame(ScoreTier::BodyContains, $hit->score);
        $this->assertNotNull($hit->location);
        $this->assertStringContainsString(self::PHRASE, $hit->snippet);

        $open = $this->app->make(TaskSearchAccess::class)->openAction($task->id, $hit->location);
        $this->assertSame([
            'task_id' => $task->id,
            'passage' => $hit->location->id,
        ], $open->arguments);

        $passage = TaskBriefPassage::fromId($hit->location->id);
        $this->journal->actAsAgentIds(TestIds::of(1), TestIds::of(1));
        $read = $this->app->make(TaskReadResult::class)->readAt($task->id, $passage);

        $this->assertStringContainsString(self::PHRASE, $read->structuredContent()['brief']);
        $this->assertSame('brief', $read->structuredContent()['text_field']);
    }

    public function test_the_inspector_opens_on_brief_at_the_passage(): void
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $task = $this->taskWithLatePhrase();
        $passage = (string) $this->briefHit()->location?->id;

        $this->actingAs($owner)
            ->get("/tasks/{$task->number}?tab=brief&passage={$passage}")
            ->assertOk()
            ->assertSee(self::PHRASE);
    }

    public function test_an_edited_away_phrase_is_unavailable(): void
    {
        $task = $this->taskWithLatePhrase();
        $passage = TaskBriefPassage::fromId((string) $this->briefHit()->location?->id);
        $edited = ['brief' => 'Nothing left here.', 'revision' => $task->revision + 1];
        Task::query()->whereKey($task->id)->update($edited);

        $this->journal->actAsAgentIds(TestIds::of(1), TestIds::of(1));
        $this->expectException(TaskPassageUnavailable::class);

        $this->app->make(TaskReadResult::class)->readAt($task->id, $passage);
    }

    private function taskWithLatePhrase(): Task
    {
        $edge = TaskSearchProvider::SEGMENT_CHARACTER_LIMIT - 8;
        $brief = str_repeat('a', $edge).' '.self::PHRASE.' '.str_repeat('b', 3000);

        return Task::factory()->create([
            'title' => 'Housekeeping',
            'brief' => $brief,
        ]);
    }

    /**
     * The brief hit the provider reaches by walking its tiers from the first call.
     */
    private function briefHit(): SearchResult
    {
        $provider = $this->app->make(TaskSearchProvider::class);

        $query = new SearchQuery(
            new SearchReader(ActorContext::forUser(self::USER_ID), SearchSurface::Palette),
            SearchWords::fromInput(self::PHRASE),
            SearchScope::within('tasks.task'),
            'tasks.task',
            10,
            WorkAllowance::forBatch(150),
        );

        $batch = $provider->search($query);

        for ($call = 0; $call < 10 && $batch->hits === [] && ! $batch->isExhausted(); $call++) {
            $batch = $provider->search($query->from($this->next($batch)));
        }

        $this->assertNotSame([], $batch->hits);

        return $batch->hits[0];
    }

    private function next(SearchBatch $batch): SourcePosition
    {
        return $batch->outcome->nextPosition() ?? $this->fail('the search ended before it found a hit');
    }
}
