<?php

declare(strict_types=1);

namespace Tests\Feature\Reads;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Values\OwnerAuthority;
use App\Reads\Contracts\ReadMeter;
use App\Reads\Exceptions\RepeatedReadRefused;
use App\Reads\Support\ScopedReadMeter;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Resolvers\TaskRecords;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestActors;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Inside one request, job or command a loop reading one row per item is refused once the same read from the same
 * place passes the loop limit, while chunk batches and other declared schedules may repeat.
 */
final class RepeatedReadTest extends TestCase
{
    use RefreshHookDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->make(CurrentActorSetter::class)->set(TestActors::user(1), new OwnerAuthority('test'));
        Task::factory()->create(['title' => 'First']);
        Task::factory()->create(['title' => 'Second']);
    }

    public function test_a_loop_reading_one_task_per_item_is_refused_past_the_loop_limit(): void
    {
        foreach (range(3, 12) as $number) {
            Task::factory()->create(['title' => "Task {$number}"]);
        }

        $records = $this->app->make(TaskRecords::class);
        $numbers = Task::query()->readLimit(12)->pluck('number')->all();
        $this->expectException(RepeatedReadRefused::class);

        $this->app->make(ReadMeter::class)->measure('one read per task', function () use ($records, $numbers): void {
            foreach ($numbers as $number) {
                $records->identityOf($number);
            }
        });
    }

    public function test_the_same_read_outside_a_measurement_or_inside_a_schedule_is_allowed(): void
    {
        foreach (range(3, 12) as $number) {
            Task::factory()->create(['title' => "Task {$number}"]);
        }

        $records = $this->app->make(TaskRecords::class);
        $numbers = Task::query()->readLimit(12)->pluck('number')->all();
        array_map(fn (int $number) => $records->identityOf($number), $numbers);

        $identities = $this->app->make(ReadMeter::class)->measure('a declared schedule', fn () => ScopedReadMeter::ofCurrentScope()->withinSchedule('test batches', fn () => array_map(fn (int $number) => $records->identityOf($number), $numbers)));

        $this->assertCount(12, $identities->value);
    }

    #[TimeLimit(seconds: 5, reason: 'It files 249 tasks one by one, each numbered, before the chunked read it checks.')]
    public function test_a_chunked_read_over_251_rows_runs_every_batch(): void
    {
        foreach (range(3, 251) as $number) {
            Task::factory()->create(['title' => "Task {$number}"]);
        }

        $seen = $this->app->make(ReadMeter::class)->measure('chunked', function (): int {
            $count = 0;
            Task::query()->readInChunks(100, function ($batch) use (&$count): void {
                $count += $batch->count();
            });

            return $count;
        });

        $this->assertSame(251, $seen->value);
    }
}
