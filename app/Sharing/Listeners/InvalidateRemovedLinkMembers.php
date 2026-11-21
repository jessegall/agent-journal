<?php

declare(strict_types=1);

namespace App\Sharing\Listeners;

use App\Contracts\Attributes\InCommandTransaction;
use App\Contracts\Listener;
use App\Links\Events\LinksRemoved;
use App\Sharing\Models\ShareMember;
use Carbon\CarbonImmutable;

/**
 * Ends the share approvals that rested on removed links, in the transaction that removed them, so a rolled-back
 * removal leaves them approved.
 */
#[InCommandTransaction]
final readonly class InvalidateRemovedLinkMembers implements Listener
{
    public function handle(LinksRemoved $event): void
    {
        ShareMember::invalidateForLinks($event->linkIds, CarbonImmutable::now());
    }
}
