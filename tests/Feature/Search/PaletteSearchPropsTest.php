<?php

declare(strict_types=1);

namespace Tests\Feature\Search;

use App\Data\Palette\PaletteHitData;
use App\Data\Palette\PaletteSearchData;
use App\Data\Palette\PaletteSourcesData;
use App\Http\Responses\SearchProps;
use App\Models\Access\User;
use App\Support\Access\AccessSettings;
use Domain\Plans\Models\Plan;
use Domain\Plans\PlansDomain;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Support\TaskReferenceRecognizer;
use Domain\Tasks\TasksDomain;
use Illuminate\Http\Request;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * The palette's search props run the common search service: for an agent and a user with equivalent access the same
 * words give the same hits in the same order as the agent tool, a task reference comes as Open Task N, a single
 * digit gives the inline hint, and the scope picker reads its sources before two characters are typed.
 */
#[TimeLimit(5, 'One case sends a signed MCP call beside the palette read.')]
final class PaletteSearchPropsTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'users', 'tasks', 'plans', 'number_groups', 'links', 'agents', 'agent_sessions', 'session_tokens',
        'agent_stacks', 'hook_calls', 'command_receipts',
    ];

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class, TasksDomain::class);
    }

    protected function setUp(): void
    {
        parent::setUp();

        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
    }

    public function test_the_same_words_give_the_same_hits_in_the_same_order_as_the_agent_tool(): void
    {
        Task::factory()->create(['title' => 'Driver']);
        Task::factory()->create(['title' => 'Old driver notes']);
        Plan::factory()->create(['title' => 'Driver rollout']);
        $caller = TestStart::start();

        $agentHits = $this->journal->mcpTool($caller, 'search', ['query' => 'driver'])->assertOk()
            ->assertJsonPath('result.isError', false)
            ->json('result.structuredContent.hits');
        $paletteHits = $this->palette(['searchQuery' => 'driver'])->hits;

        $this->assertSame(
            array_map(fn (array $hit): string => $hit['reference']['id'], $agentHits),
            array_map(fn (PaletteHitData $hit): string => $hit->recordId, $paletteHits),
        );
        $this->assertNotNull($paletteHits[0]->href);
    }

    public function test_a_task_reference_comes_as_open_task_n_and_a_digit_gives_the_hint(): void
    {
        $task = Task::factory()->create(['title' => 'Search through everything']);

        $direct = $this->palette(['searchQuery' => "task {$task->number}"]);
        $short = $this->palette(['searchQuery' => '7']);

        $this->assertStringEndsWith((string) $task->number, (string) $direct->directOpenLabel);
        $this->assertInstanceOf(PaletteHitData::class, $direct->directOpen);
        $this->assertSame($task->id, $direct->directOpen->recordId);
        $this->assertSame('too_short', $short->status);
        $this->assertContains(new TaskReferenceRecognizer()->hint('7'), $short->hints);
    }

    public function test_the_scope_picker_reads_its_sources_before_two_characters(): void
    {
        $sources = $this->sources(['searchPrefix' => 't']);

        $this->assertContains('tasks.task', array_map(fn ($source) => $source->key, $sources->sources));
    }

    /**
     * @param  array<string, string>  $query
     */
    private function palette(array $query): PaletteSearchData
    {
        return ($this->props($query)['search'])();
    }

    /**
     * @param  array<string, string>  $query
     */
    private function sources(array $query): PaletteSourcesData
    {
        return ($this->props($query)['searchSources'])();
    }

    /**
     * @param  array<string, string>  $query
     * @return array<string, mixed>
     */
    private function props(array $query): array
    {
        $this->app->forgetScopedInstances();
        $this->journal->actAsUserId(TestIds::of(7));
        $request = Request::create('/', 'GET', $query);
        $request->setLaravelSession($this->app->make('session.store'));

        return $this->app->make(SearchProps::class)->of($request);
    }
}
