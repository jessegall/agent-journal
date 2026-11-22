<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Events\RunChanged;
use App\Resolvers\Support\RunSnapshotResolver;
use App\Support\RunUpdates;
use Illuminate\Support\Facades\Event;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\SendsSignedCalls;
use Tests\TestCase;

/**
 * A run's live updates carry increasing numbers, a chatty part sends at most one a second while an end goes out at
 * once, and a snapshot restores the run with the number of the last update it includes (doc 21 revision 6, sections
 * 54 and 69; stories 131, 136 and 198).
 */
final class RunUpdatesTest extends TestCase
{
    use RefreshHookDatabase;
    use RunsAcmeRequests;
    use SendsSignedCalls;

    protected function setUp(): void
    {
        parent::setUp();

        $this->openAcmeRequest();
    }

    public function test_progress_is_throttled_and_an_end_goes_out_at_once_with_the_next_number(): void
    {
        $part = $this->normalRun(0, self::PASSED_OUTPUT);
        $this->travel(2)->seconds();
        Event::fake([RunChanged::class]);
        $updates = $this->app->make(RunUpdates::class);

        $updates->progressed($part);
        $updates->progressed($part);
        $updates->settled($part);

        $sequences = [];
        Event::assertDispatched(RunChanged::class, function (RunChanged $changed) use (&$sequences): bool {
            $sequences[] = $changed->sequence;

            return true;
        });
        $this->assertCount(2, $sequences);
        $this->assertSame($sequences[0] + 1, $sequences[1]);
    }

    public function test_a_snapshot_restores_every_part_with_the_last_update_number(): void
    {
        $part = $this->normalRun(0, self::PASSED_OUTPUT);
        $this->app->make(RunUpdates::class)->settled($part);

        $snapshot = $this->app->make(RunSnapshotResolver::class)->snapshot($part->process_run_id);

        $this->assertSame($part->id, $snapshot->parts[0]->id);
        $this->assertSame('ended', $snapshot->parts[0]->lifecycle);
        $this->assertGreaterThanOrEqual(1, $snapshot->sequence);

        config(['processes.project_key' => 'another-project']);
        $this->assertThrows(
            fn () => $this->app->make(RunSnapshotResolver::class)->snapshot($part->process_run_id),
            NotFoundHttpException::class,
        );
    }
}
