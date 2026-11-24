<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Reads\ReadMeter;
use App\Contracts\Sharing\ShareBudget;
use App\Exceptions\ShareBudgetExceeded;
use Carbon\CarbonImmutable;

/**
 * The work one preview or public read may still do: queries counted through the read meter, time from its start,
 * loaded text and safe metadata counted apart within one loaded-bytes limit, rendered output, records, links and
 * relation hops. Every provider call of that preview or read is charged to the same budget, which lives for that one
 * preview or read only. Core builds it; providers see only the ShareBudget contract.
 */
final class MeteredShareBudget implements ShareBudget
{
    private const int MEBIBYTE = 1_048_576;

    private int $queries = 0;

    private int $textBytes = 0;

    private int $metadataBytes = 0;

    private int $renderedBytes = 0;

    private int $records = 0;

    private int $links = 0;

    private bool $isRunning = false;

    private function __construct(
        public readonly int $mostQueries,
        public readonly int $mostMilliseconds,
        public readonly int $mostLoadedBytes,
        public readonly int $mostRenderedBytes,
        public readonly int $mostRecords,
        public readonly int $mostLinks,
        public readonly int $mostHops,
        private readonly ReadMeter $meter,
        private readonly CarbonImmutable $startedAt,
    ) {}

    /**
     * The budget of an owner's preview: 200 queries, two seconds, 4 MiB of metadata, 1,000 records, 2,000 candidate
     * links and four hops.
     */
    public static function forPreview(ReadMeter $meter): self
    {
        return new self(
            200,
            2_000,
            4 * self::MEBIBYTE,
            4 * self::MEBIBYTE,
            1_000,
            2_000,
            4,
            $meter,
            CarbonImmutable::now(),
        );
    }

    /**
     * The budget of one public read: 32 queries, two seconds, 4 MiB loaded, 2 MiB rendered, and the preview's record,
     * link and hop limits.
     */
    public static function forRead(ReadMeter $meter): self
    {
        return new self(
            32,
            2_000,
            4 * self::MEBIBYTE,
            2 * self::MEBIBYTE,
            1_000,
            2_000,
            4,
            $meter,
            CarbonImmutable::now(),
        );
    }

    /**
     * Runs a piece of record work and charges the queries the read meter counted for it; work run inside it on the
     * same budget is counted once.
     *
     * @template TValue
     *
     * @param  callable(): TValue  $work
     * @return TValue
     *
     * @throws ShareBudgetExceeded
     */
    public function run(callable $work): mixed
    {
        if ($this->isRunning) {
            return $work();
        }

        $this->isRunning = true;

        try {
            $measurement = $this->meter->measure('share budget', $work);
        } finally {
            $this->isRunning = false;
        }

        $this->queries += $measurement->counts->queriesRun;

        if ($this->queries > $this->mostQueries) {
            throw ShareBudgetExceeded::forQueries($this->mostQueries);
        }

        $this->assertTimeWithinBudget();

        return $measurement->measuredAnswer;
    }

    /**
     * @throws ShareBudgetExceeded
     */
    public function chargeText(int $bytes): void
    {
        $this->textBytes += $bytes;
        $this->assertLoadedBytesWithinBudget();
    }

    /**
     * @throws ShareBudgetExceeded
     */
    public function chargeMetadata(int $bytes): void
    {
        $this->metadataBytes += $bytes;
        $this->assertLoadedBytesWithinBudget();
    }

    /**
     * Charges escaped output the response will carry.
     *
     * @throws ShareBudgetExceeded
     */
    public function chargeRendered(int $bytes): void
    {
        $this->renderedBytes += $bytes;

        if ($this->renderedBytes > $this->mostRenderedBytes) {
            throw ShareBudgetExceeded::forBytes('rendered output', $this->mostRenderedBytes);
        }
    }

    /**
     * Charges records reached, a rejected candidate as much as an accepted one.
     *
     * @throws ShareBudgetExceeded
     */
    public function chargeRecords(int $count): void
    {
        $this->records += $count;

        if ($this->records > $this->mostRecords) {
            throw ShareBudgetExceeded::forNodes($this->mostRecords);
        }

        $this->assertTimeWithinBudget();
    }

    /**
     * @throws ShareBudgetExceeded
     */
    public function chargeLinks(int $count): void
    {
        $this->links += $count;

        if ($this->links > $this->mostLinks) {
            throw ShareBudgetExceeded::forLinks($this->mostLinks);
        }

        $this->assertTimeWithinBudget();
    }

    /**
     * @throws ShareBudgetExceeded
     */
    public function assertHopsWithinBudget(int $hops): void
    {
        if ($hops > $this->mostHops) {
            throw ShareBudgetExceeded::forHops($this->mostHops);
        }
    }

    public function queries(): int
    {
        return $this->queries;
    }

    public function textBytes(): int
    {
        return $this->textBytes;
    }

    public function metadataBytes(): int
    {
        return $this->metadataBytes;
    }

    /**
     * @throws ShareBudgetExceeded
     */
    private function assertLoadedBytesWithinBudget(): void
    {
        if ($this->textBytes + $this->metadataBytes > $this->mostLoadedBytes) {
            throw ShareBudgetExceeded::forBytes('loaded records', $this->mostLoadedBytes);
        }
    }

    /**
     * @throws ShareBudgetExceeded
     */
    private function assertTimeWithinBudget(): void
    {
        if ($this->startedAt->diffInMilliseconds(CarbonImmutable::now()) > $this->mostMilliseconds) {
            throw ShareBudgetExceeded::forTime($this->mostMilliseconds);
        }
    }
}
