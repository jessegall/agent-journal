<?php

declare(strict_types=1);

namespace Domain\Documents\Api\Events;

use App\Actors\Support\ActorIdentity;
use App\Contracts\Event;
use App\Ui\Contracts\UpdatesUserInterface;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A session's dock gained, hid or showed again a record's card. It carries the session and the record, never text.
 */
final readonly class RecordDockChanged implements Event, ShouldDispatchAfterCommit, UpdatesUserInterface
{
    public function __construct(public ActorIdentity $recipient, public string $recordType, public string $recordId) {}
}
