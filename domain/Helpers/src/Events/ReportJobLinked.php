<?php

declare(strict_types=1);

namespace Domain\Helpers\Events;

use App\Contracts\Events\Event;

/**
 * A filed report was tied, once and for good, to the helper job it answers. It carries ids and the report's number only.
 */
final readonly class ReportJobLinked implements Event
{
    public function __construct(
        public string $reportId,
        public int $reportNumber,
        public string $helperJobId,
    ) {}
}
