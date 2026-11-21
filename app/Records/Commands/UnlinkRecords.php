<?php

declare(strict_types=1);

namespace App\Records\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Records\Policies\RecordLinkPolicy;
use App\Records\Support\RecordIdentity;

/**
 * Removes the link between two records in both directions and keeps both records; unlinking again changes nothing.
 *
 * @extends Command<null>
 */
#[Authorize(RecordLinkPolicy::class, AccessType::Edit)]
final readonly class UnlinkRecords extends Command
{
    public function __construct(public RecordIdentity $source, public RecordIdentity $target) {}
}
