<?php

declare(strict_types=1);

namespace App\Hosts;

use App\Hosts\Protocol\Data\HostFrameData;
use App\Hosts\Protocol\Data\HostOutputData;
use App\Values\FeedEntry;
use Illuminate\Contracts\Redis\Factory as RedisFactory;
use Illuminate\Redis\Connections\Connection;

/**
 * What each process on a host printed lately, kept in Redis for an hour: its latest frame, and its last frames and
 * chunks in a stream a worker reads after its cursor. It is a cache: a worker that finds no frame orders a snapshot.
 */
final readonly class ProcessFeed
{
    public const int TTL_SECONDS = 3600;

    /**
     * The most frames and chunks of a process kept in its stream.
     */
    public const int ENTRY_LIMIT = 256;

    /**
     * What Redis takes for a read that does not wait.
     */
    private const int NO_BLOCK = -1;

    /**
     * About the most bytes a process's stream keeps: a large entry shortens how many are kept.
     */
    public const int BYTE_LIMIT = 4 * 1024 * 1024;

    /**
     * The cursor of a stream read from its start.
     */
    public const string FIRST_CURSOR = '0';

    public function __construct(private RedisFactory $redis) {}

    public function push(string $processId, HostOutputData $output): void
    {
        $key = self::streamKey($processId);

        foreach ($output->frames as $frame) {
            $encoded = (string) json_encode($frame->toArray(), JSON_THROW_ON_ERROR);
            $this->connection()->xadd($key, '*', ['frame' => $encoded], self::entriesKeptBeside($encoded), true);
            $this->connection()->setex(self::latestKey($processId), self::TTL_SECONDS, $encoded);
        }

        foreach ($output->chunks as $chunk) {
            $encoded = (string) json_encode($chunk->toArray(), JSON_THROW_ON_ERROR);
            $this->connection()->xadd($key, '*', ['chunk' => $encoded], self::entriesKeptBeside($encoded), true);
        }

        $this->connection()->expire($key, self::TTL_SECONDS);
    }

    /**
     * Tells the process's worker that one of its orders was answered.
     */
    public function markOrder(string $processId, string $orderId): void
    {
        $key = self::streamKey($processId);
        $this->connection()->xadd($key, '*', ['answered' => $orderId], self::ENTRY_LIMIT, true);
        $this->connection()->expire($key, self::TTL_SECONDS);
    }

    /**
     * Tells the process's worker that the process ended, so an idle worker learns it from its feed alone.
     */
    public function markEnded(string $processId): void
    {
        $key = self::streamKey($processId);
        $this->connection()->xadd($key, '*', ['ended' => '1'], self::ENTRY_LIMIT, true);
        $this->connection()->expire($key, self::TTL_SECONDS);
    }

    public function latestFrame(string $processId): HostFrameData|null
    {
        $encoded = $this->connection()->get(self::latestKey($processId));

        if (! is_string($encoded)) {
            return null;
        }

        return HostFrameData::from(json_decode($encoded, true, flags: JSON_THROW_ON_ERROR));
    }

    /**
     * The entries pushed after the cursor, waiting up to the milliseconds when there are none yet.
     *
     * @return list<FeedEntry>
     */
    public function after(string $processId, string $cursor, int $waitMs): array
    {
        return $this->read([self::streamKey($processId) => $cursor], $waitMs);
    }

    /**
     * What a worker waits on: the process's new output and its runtime's wakes together, after their cursors; a wait
     * of none reads what is there and returns, as Redis would block for good on a wait of zero.
     *
     * @param  array<string, string>  $cursors  stream key => cursor
     * @return list<FeedEntry>
     */
    public function read(array $cursors, int $waitMs): array
    {
        $block = $waitMs > 0 ? $waitMs : self::NO_BLOCK;
        $read = $this->connection()->xread($cursors, self::ENTRY_LIMIT, $block);

        if (! is_array($read)) {
            return [];
        }

        $entries = [];

        foreach ($read as $stream => $streamEntries) {
            foreach ($streamEntries as $cursor => $fields) {
                $entries[] = FeedEntry::of(self::unprefixed((string) $stream), (string) $cursor, $fields);
            }
        }

        return $entries;
    }

    /**
     * The cursor of the stream's newest entry, so a reader that starts now reads only what comes after.
     */
    public function lastCursor(string $stream): string
    {
        $newest = $this->connection()->xrevrange($stream, '+', '-', 1);

        if (is_array($newest) && $newest !== []) {
            return (string) array_key_first($newest);
        }

        return self::FIRST_CURSOR;
    }

    /**
     * How many entries the stream keeps once an entry this large is added, so it stays near BYTE_LIMIT.
     */
    public static function entriesKeptBeside(string $encoded): int
    {
        return max(1, min(self::ENTRY_LIMIT, intdiv(self::BYTE_LIMIT, max(1, strlen($encoded)))));
    }

    public static function streamKey(string $processId): string
    {
        return "host:process:{$processId}";
    }

    public static function latestKey(string $processId): string
    {
        return "host:process:{$processId}:latest";
    }

    /**
     * A stream's key as this class names it, without the connection's prefix Redis answers with.
     */
    private static function unprefixed(string $stream): string
    {
        $start = strpos($stream, 'host:process:');
        $start = $start === false ? strpos($stream, 'driver:wake:') : $start;

        if ($start === false) {
            return $stream;
        }

        return substr($stream, $start);
    }

    private function connection(): Connection
    {
        return $this->redis->connection();
    }
}
