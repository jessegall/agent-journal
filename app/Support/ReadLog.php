<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Reads\ReadLog as ReadLogContract;
use App\Values\ReadCounts;
use Psr\Log\LoggerInterface;

/**
 * Writes what one entry read to the debug log: its label and counts, never SQL text or keys. It touches no database.
 */
final readonly class ReadLog implements ReadLogContract
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
