<?php

declare(strict_types=1);

namespace Domain\Documents\Api\Events;

use App\Actors\Support\ActorContext;
use App\Contracts\Event;
use App\Ui\Contracts\UpdatesUserInterface;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A report was filed. It carries ids and the number, never the text.
 */
final readonly class ReportFiled implements Event, ShouldDispatchAfterCommit, UpdatesUserInterface
{
    public function __construct(
        public string $reportId,
        public int $number,
        public ActorContext $actor,
    ) {}
}
