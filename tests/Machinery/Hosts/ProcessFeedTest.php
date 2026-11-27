<?php

declare(strict_types=1);

namespace Tests\Machinery\Hosts;

use App\Hosts\HostWake;
use App\Hosts\ProcessFeed;
use App\Hosts\Protocol\Data\HostOutputData;
use Illuminate\Contracts\Redis\Factory as RedisFactory;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\TestCase;

/**
 * A process's output is kept for an hour: its latest frame, and the frames and chunks after a cursor, which a worker
 * waits on together with its runtime's wakes.
 */
#[TestsMachinery(ProcessFeed::class)]
final class ProcessFeedTest extends TestCase
{
    public function test_the_latest_frame_is_kept_for_an_hour_and_after_gives_only_newer_entries(): void
    {
        $feed = $this->journal->service(ProcessFeed::class);
        $process = (string) Str::ulid();

        $feed->push($process, $this->screenShowing('first'));
        $first = $feed->after($process, ProcessFeed::FIRST_CURSOR, 0);
        $feed->push($process, $this->screenShowing('second'));
        $newer = $feed->after($process, $first[0]->cursor, 0);

        $this->assertSame(['second'], array_map(fn ($entry) => $entry->frame?->rows[0], $newer));
        $this->assertSame('second', $feed->latestFrame($process)?->rows[0]);
        $this->assertGreaterThan(
            ProcessFeed::TTL_SECONDS - 5,
            $this->journal->service(RedisFactory::class)->connection()->ttl(ProcessFeed::streamKey($process)),
        );
    }

    public function test_a_pushed_frame_or_a_runtime_wake_ends_a_workers_wait(): void
    {
        $feed = $this->journal->service(ProcessFeed::class);
        $process = (string) Str::ulid();
        $runtime = (string) Str::ulid();
        $cursors = [ProcessFeed::streamKey($process) => '$', HostWake::runtimeKey($runtime) => '$'];

        $feed->push($process, $this->screenShowing('ready'));
        $this->journal->service(HostWake::class)->wakeRuntime($runtime);

        $this->assertSame([], $feed->read($cursors, 50));
        $this->assertCount(2, $feed->read([ProcessFeed::streamKey($process) => '0', HostWake::runtimeKey($runtime) => '0'], 50));
    }

    public function test_large_entries_shorten_how_many_the_stream_keeps(): void
    {
        $this->journal->assertResult(
            [ProcessFeed::ENTRY_LIMIT, 16, 1],
            [
                ProcessFeed::entriesKeptBeside('small'),
                ProcessFeed::entriesKeptBeside(str_repeat('a', 256 * 1024)),
                ProcessFeed::entriesKeptBeside(str_repeat('a', ProcessFeed::BYTE_LIMIT * 2)),
            ],
        );
    }

    private function screenShowing(string $firstRow): HostOutputData
    {
        return HostOutputData::from(['frames' => [[
            'rows' => [$firstRow],
            'cursor_row' => 0,
            'cursor_column' => 0,
            'columns' => 80,
            'buffer' => 'normal',
            'captured' => 1,
            'unchanged_ms' => [0],
        ]], 'chunks' => []]);
    }
}
