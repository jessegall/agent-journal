<?php

declare(strict_types=1);

namespace App\Support;

use App\Values\SearchCallMeter;
use Psr\Log\LoggerInterface;

/**
 * Writes one line per source per search call for an operator diagnosing slow searches: the source key, the call
 * number, the time it took, the rows it examined, the bytes it read and how its last batch ended. It never receives
 * the words, titles or excerpts, so none of them can reach a log.
 */
final readonly class SearchDiagnostics
{
    public const string MESSAGE = 'search source call';

    public function __construct(private LoggerInterface $log) {}

    public function record(int $call, SearchCallMeter $meter): void
    {
        foreach ($meter->sources() as $sourceKey => $work) {
            $this->log->info(self::MESSAGE, [
                'source' => $sourceKey,
                'call' => $call,
                'elapsed_ms' => round($work['elapsed_us'] / 1000, 1),
                'rows_examined' => $work['rows'],
                'bytes_read' => $work['bytes'],
                'outcome' => $work['outcome'],
            ]);
        }
    }
}
