<?php

declare(strict_types=1);

namespace App\Links\Commands\UnlinkRecords;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\RecordLinkPolicy;
use App\Support\Command;
use App\Support\RecordIdentity;

/**
 * Removes the link between two records in both directions and keeps both records; unlinking again changes nothing.
 *
 * @extends Command<null>
 */
#[Authorize(RecordLinkPolicy::class, AccessType::Edit)]
final readonly class UnlinkRecordsCommand extends Command
{
    public function __construct(public RecordIdentity $source, public RecordIdentity $target) {}
}
