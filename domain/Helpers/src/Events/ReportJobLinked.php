<?php

declare(strict_types=1);

namespace Domain\Helpers\Events;

use App\Contracts\Event;

/**
 * A filed report was tied, once and for good, to the helper job it answers. It carries ids only.
 */
final readonly class ReportJobLinked implements Event
{
    public function __construct(
        public string $reportId,
        public string $helperJobId,
    ) {}
}
