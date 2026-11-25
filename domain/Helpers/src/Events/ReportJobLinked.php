<?php

declare(strict_types=1);

namespace Domain\Helpers\Events;

/**
 * A filed report was tied, once and for good, to the helper job it answers. It carries ids and the report's number only.
 */
final readonly class ReportJobLinked implements HelperEvent
{
    public function __construct(
        public string $reportId,
        public int $reportNumber,
        public string $helperJobId,
    ) {}
}
