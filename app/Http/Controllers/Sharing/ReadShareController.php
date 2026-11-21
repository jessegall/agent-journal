<?php

declare(strict_types=1);

namespace App\Http\Controllers\Sharing;

use App\Bus\Enums\CommandEntry;
use App\Bus\Support\EntryDispatchers;
use App\Http\Requests\Sharing\ReadShareRequest;
use App\Http\Responses\Sharing\SharedPageResponses;
use App\Sharing\Commands\ReadShare;
use App\Sharing\Exceptions\ShareLinkRefused;
use App\Sharing\Exceptions\ShareReadLimited;
use App\Sharing\Support\ReadPermit;
use App\Sharing\Support\ReadPermits;
use App\Sharing\Support\ShareReadLimits;
use App\Sharing\Support\SourceAddressRule;
use Illuminate\Http\Response;

/**
 * The public bridge: turns the token into a permit within the read limits, acts as the system for exactly the one
 * read command, clears the permits however it ends, and renders the page only after the read committed. No gateway
 * has a proven source-address header yet, so forwarded addresses are ignored.
 */
final readonly class ReadShareController
{
    public function __invoke(
        ReadShareRequest $request,
        ReadPermits $permits,
        ShareReadLimits $limits,
        EntryDispatchers $dispatchers,
        SharedPageResponses $responses,
    ): Response {
        try {
            $permit = $this->issue($request, $permits, $limits);
            $limits->admitRead($permit->shareId);

            $read = new ReadShare(
                $permit->reference,
                $request->sharePath(),
                $request->cursor(),
                $request->wantsHeadOnly(),
            );

            $page = $dispatchers->runAsJournal(CommandEntry::ShareGateway, 'share read', $read);
        } finally {
            $permits->clear();
        }

        return $responses->page($page);
    }

    /**
     * The permit of the token; a token that leads nowhere is counted against the invalid-link limits first.
     *
     * @throws ShareLinkRefused
     * @throws ShareReadLimited
     */
    private function issue(ReadShareRequest $request, ReadPermits $permits, ShareReadLimits $limits): ReadPermit
    {
        try {
            return $permits->issue($request->token());
        } catch (ShareLinkRefused $refused) {
            $limits->countInvalid(SourceAddressRule::none()->sourceOf($request));

            throw $refused;
        }
    }
}
