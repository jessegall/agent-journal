<?php

declare(strict_types=1);

namespace App\Records\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use App\Links\Models\Link;
use App\Records\Enums\RecordLinkAbility;
use App\Records\Handlers\LinkRecordsHandler;
use App\Records\Policies\RecordLinkPolicy;
use App\Records\Support\RecordIdentity;

/**
 * Links a record the actor may change to one they may read; linking again changes nothing.
 *
 * @extends Command<null>
 */
#[HandledBy(LinkRecordsHandler::class)]
#[Authorize(RecordLinkPolicy::class, RecordLinkAbility::Work)]
final readonly class LinkRecords extends Command implements HasAuthorizationSubject
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
