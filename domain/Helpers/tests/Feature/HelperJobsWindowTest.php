<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Feature;

use App\Models\Agents\Agent;
use App\Support\ActorIdentity;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutPartData;
use Domain\Helpers\Http\Pages\Resolvers\HelperJobsLayoutResolver;
use Domain\Helpers\Models\HelperIdentity;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Models\HelperPurpose;
use Domain\Helpers\Tests\TestCase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\Support\RefreshHookDatabase;

/**
 * The Helper jobs window, the first page declared as a layout: a title, how many jobs are open and the newest jobs,
 * or an empty state, read in two bounded queries.
 */
final class HelperJobsWindowTest extends TestCase
{
    use RefreshHookDatabase;

    private const string NO_JOBS_TEXT = 'No helper has had a job yet';

    private const string ONE_OPEN_TEXT = '1 job is open';

    public function test_no_jobs_reads_as_a_title_and_an_empty_state(): void
    {
        $this->actAsUser('owner');

        $root = $this->read()->root;

        $this->assertSame([
            'title',
            'none',
        ], $this->keysOf($root));
        $this->assertSame(self::NO_JOBS_TEXT, $root->children[1]->text);
    }

    public function test_jobs_read_as_the_open_count_and_the_newest_jobs_in_two_queries(): void
    {
        $this->jobs(['Read the plan']);

        DB::flushQueryLog();
        DB::enableQueryLog();
        $root = $this->read()->root;
        $queries = count(DB::getQueryLog());
        DB::disableQueryLog();

        $this->assertSame([
            'title',
            'open',
            'jobs',
        ], $this->keysOf($root));
        $this->assertSame(self::ONE_OPEN_TEXT, $root->children[1]->text);
        $this->assertSame(['Read the plan'], array_map(fn ($row) => $row->label, $root->children[2]->rows));
        $this->assertLessThanOrEqual(2, $queries);
    }

    public function test_a_full_page_of_jobs_stays_within_its_payload_budget(): void
    {
        $this->jobs(array_map(fn (int $job) => str_repeat("Brief {$job} ", 20), range(1, 30)));

        $bytes = strlen(json_encode($this->read()->toArray(), JSON_THROW_ON_ERROR));

        $this->assertCount(25, $this->read()->root->children[2]->rows);
        $this->assertLessThan(16 * 1024, $bytes);
    }

    /**
     * One helper's jobs with these briefs, made by the owner.
     *
     * @param  list<string>  $briefs
     */
    private function jobs(array $briefs): void
    {
        $parent = $this->actAsUser('owner');

        $helper = HelperIdentity::create(
            $parent,
            ActorIdentity::of(Agent::create('Helper '.Str::random(6), 'read-only-helper')),
            'read-only-helper',
            'read-only-helper',
        );

        $purpose = HelperPurpose::free($parent, 'read-only-helper', 'General review');

        array_map(
            fn (string $brief) => HelperJob::create(
                $helper,
                $purpose,
                $parent,
                $brief,
                [],
                self::sessionStartFor(hash('xxh64', $brief)),
            ),
            $briefs,
        );
    }

    private function read(): DeclaredLayoutData
    {
        return $this->app->make(HelperJobsLayoutResolver::class)->read();
    }

    /**
     * @return list<string>
     */
    private function keysOf(LayoutPartData $part): array
    {
        return array_map(fn (LayoutPartData $child) => $child->key, $part->children);
    }
}
