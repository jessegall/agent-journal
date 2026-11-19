<?php

declare(strict_types=1);

namespace App\Reads\Support;

use App\Reads\Contracts\LogsReads;
use App\Reads\Values\ReadCounts;
use Psr\Log\LoggerInterface;

/**
 * Writes what one entry read to the debug log: its label and counts, never SQL text or keys. It touches no database.
 */
final readonly class ReadLog implements LogsReads
{
    public function __construct(private LoggerInterface $logger) {}

    public function record(string $label, ReadCounts $counts): void
    {
        $this->logger->debug('reads', [
            'label' => $label,
            'models_loaded' => $counts->modelsLoaded,
            'queries_run' => $counts->queriesRun,
            'queries_refused' => $counts->queriesRefused,
        ]);
    }
}
