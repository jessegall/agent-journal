<?php

declare(strict_types=1);

namespace Domain\Documents\Api\Events;

use App\Contracts\Event;
use App\Ui\Contracts\UpdatesUserInterface;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A document or report was settled as needing no more attention. It carries ids only.
 */
final readonly class RecordSettled implements Event, ShouldDispatchAfterCommit, UpdatesUserInterface
{
    public function __construct(public string $recordType, public string $recordId) {}
}
