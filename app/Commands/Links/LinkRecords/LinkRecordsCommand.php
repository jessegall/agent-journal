<?php

declare(strict_types=1);

namespace App\Commands\Links\LinkRecords;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Policies\RecordLinkPolicy;
use App\Support\Command;
use App\Support\RecordIdentity;

/**
 * Links a record the actor may change to one they may read; linking again changes nothing.
 *
 * @extends Command<null>
 */
#[Authorize(RecordLinkPolicy::class, AccessType::Create)]
final readonly class LinkRecordsCommand extends Command
{
    public function __construct(public RecordIdentity $source, public RecordIdentity $target) {}
}
