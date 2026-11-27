<?php

declare(strict_types=1);

namespace Domain\Documents\Events;

use App\Navigation\Contracts\ClientUpdate;
use App\Support\ActorReference;

/**
 * A report was filed. It carries ids and the number, never the text.
 */
final readonly class ReportFiled implements ClientUpdate, DocumentEvent
{
    public function __construct(
        public string $reportId,
        public int $number,
        public ActorReference $actor,
    ) {}
}
