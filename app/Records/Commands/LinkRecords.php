<?php

declare(strict_types=1);

namespace App\Records\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Records\Policies\RecordLinkPolicy;
use App\Records\Support\RecordIdentity;

/**
 * Links a record the actor may change to one they may read; linking again changes nothing.
 *
 * @extends Command<null>
 */
#[Authorize(RecordLinkPolicy::class, AccessType::Create)]
final readonly class LinkRecords extends Command
{
    public function __construct(public RecordIdentity $source, public RecordIdentity $target) {}
}
