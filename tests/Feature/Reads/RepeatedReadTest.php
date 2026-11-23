<?php

declare(strict_types=1);

namespace Tests\Feature\Reads;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Reads\ReadMeter;
use App\Exceptions\RepeatedReadRefused;
use App\Support\ScopedReadMeter;
use App\Values\OwnerAuthority;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Resolvers\TaskRecords;
use Illuminate\Database\Eloquent\Factories\Sequence;
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
        Task::factory()
            ->count(10)
            ->sequence(fn (Sequence $sequence) => ['title' => 'Task '.($sequence->index + 3)])
            ->create();

        $records = $this->app->make(TaskRecords::class);
        $numbers = Task::query()->limit(12)->pluck('number')->all();
        $this->expectException(RepeatedReadRefused::class);

        $this->app->make(ReadMeter::class)->measure('one read per task', function () use ($records, $numbers): void {
            foreach ($numbers as $number) {
                $records->identityOf($number);
            }
        });
    }

    public function test_parts_measured_apart_count_their_repeated_reads_on_their_own(): void
    {
        Task::factory()
            ->count(10)
            ->sequence(fn (Sequence $sequence) => ['title' => 'Task '.($sequence->index + 3)])
            ->create();

        $records = $this->app->make(TaskRecords::class);
        $numbers = Task::query()->limit(12)->pluck('number')->all();
        $meter = ScopedReadMeter::ofCurrentScope();
        $readHalf = fn (array $half) => fn () => array_map(fn (int $number) => $records->identityOf($number), $half);

        $parts = $meter->measure('a page of two windows', fn () => [
            $meter->measureApart('first window', $readHalf(array_slice($numbers, 0, 6)))->measuredAnswer,
            $meter->measureApart('second window', $readHalf(array_slice($numbers, 6)))->measuredAnswer,
        ])->measuredAnswer;

        $this->assertCount(6, $parts[1]);
        $this->expectException(RepeatedReadRefused::class);

        $meter->measure('a page', fn () => $meter->measureApart('one window', $readHalf($numbers)));
    }

    public function test_the_same_read_outside_a_measurement_or_inside_a_schedule_is_allowed(): void
    {
        Task::factory()
            ->count(10)
            ->sequence(fn (Sequence $sequence) => ['title' => 'Task '.($sequence->index + 3)])
            ->create();

        $records = $this->app->make(TaskRecords::class);
        $numbers = Task::query()->limit(12)->pluck('number')->all();
        array_map(fn (int $number) => $records->identityOf($number), $numbers);

        $identities = $this->app->make(ReadMeter::class)->measure(
            'a declared schedule',
            fn () => ScopedReadMeter::ofCurrentScope()->withinSchedule(
                'test batches',
                fn () => array_map(fn (int $number) => $records->identityOf($number), $numbers),
            ),
        );

        $this->assertCount(12, $identities->measuredAnswer);
    }

    #[TimeLimit(seconds: 5, reason: 'It files 249 tasks one by one, each numbered, before the chunked read it checks.')]
    public function test_a_chunked_read_over_251_rows_runs_every_batch(): void
    {
        Task::factory()
            ->count(249)
            ->sequence(fn (Sequence $sequence) => ['title' => 'Task '.($sequence->index + 3)])
            ->create();

        $seen = $this->app->make(ReadMeter::class)->measure('chunked', function (): int {
            $count = 0;
            Task::query()->readInChunks(100, function ($batch) use (&$count): void {
                $count += $batch->count();
            });

            return $count;
        });

        $this->assertSame(251, $seen->measuredAnswer);
    }
}
