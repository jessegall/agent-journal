<?php

declare(strict_types=1);

namespace App\Records\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Records\Handlers\LinkRecordsHandler;
use App\Records\Support\RecordIdentity;

/**
 * Links a record the actor may change to one they may read; linking again changes nothing.
 *
 * @implements Command<null>
 */
#[HandledBy(LinkRecordsHandler::class)]
final readonly class LinkRecords implements Command
{
    public function __construct(public RecordIdentity $source, public RecordIdentity $target) {}
}
