<?php

declare(strict_types=1);

namespace App\Sharing\Listeners;

use App\Contracts\Attributes\InCommandTransaction;
use App\Contracts\Listener;
use App\Links\Events\LinksRemoved;
use App\Links\Models\Link;
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
        $this->invalidateForLinks($event->linkIds, CarbonImmutable::now());
    }

    /**
     * Ends the approval of every member that rested on one of these links; a link made again has a new id, so only a
     * refreshed scope approves it.
     *
     * @param  list<string>  $ids
     */
    private function invalidateForLinks(array $ids, CarbonImmutable $at): void
    {
        ShareMember::query()->onLinks($ids)->stillApproved()->update(['invalidated_at' => $at]);
    }
}
