<?php

declare(strict_types=1);

namespace App\Records\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Links\Models\Link;
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
final readonly class UnlinkRecords extends Command implements HasAuthorizationSubject
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
