<?php

declare(strict_types=1);

namespace App\Records\Commands;

use App\Assignments\Support\RecordIdentity;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Records\Handlers\UnlinkRecordsHandler;

/**
 * Removes the link between two records in both directions and keeps both records; unlinking again changes nothing.
 *
 * @implements Command<null>
 */
#[HandledBy(UnlinkRecordsHandler::class)]
final readonly class UnlinkRecords implements Command
{
    public function __construct(public RecordIdentity $source, public RecordIdentity $target) {}
}
