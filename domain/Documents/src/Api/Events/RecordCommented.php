<?php

declare(strict_types=1);

namespace Domain\Documents\Api\Events;

use App\Contracts\Event;
use App\Ui\Contracts\UpdatesUserInterface;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A user commented on a document or a report. It carries ids only.
 */
final readonly class RecordCommented implements Event, ShouldDispatchAfterCommit, UpdatesUserInterface
{
    public function __construct(public string $commentId, public string $recordType, public string $recordId) {}
}
