<?php

declare(strict_types=1);

namespace App\Records\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Links\Models\Link;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Records\Enums\RecordLinkAbility;
use App\Records\Handlers\UnlinkRecordsHandler;
use App\Records\Policies\RecordLinkPolicy;
use App\Records\Support\RecordIdentity;

/**
 * Removes the link between two records in both directions and keeps both records; unlinking again changes nothing.
 *
 * @extends Command<null>
 */
#[HandledBy(UnlinkRecordsHandler::class)]
#[Authorize(RecordLinkPolicy::class, RecordLinkAbility::Work)]
#[Operation('unlink_records', ResourceAreaType::JournalContent, AccessType::Edit)]
final readonly class UnlinkRecords extends Command implements AuthorizedCommand
{
    public function __construct(public RecordIdentity $source, public RecordIdentity $target) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Link::class;
    }
}
