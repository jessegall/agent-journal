<?php

declare(strict_types=1);

namespace App\Http\Controllers\Sharing;

use App\Actors\Support\ActorStore;
use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Sharing\ReadShareRequest;
use App\Http\Responses\Sharing\SharedPageResponses;
use App\Sharing\Commands\ReadShare;
use App\Sharing\Support\ReadPermits;
use Illuminate\Http\Response;

/**
 * The public bridge: turns the token into a permit, acts as the system for exactly the one read command, clears the
 * permits however it ends, and renders the page only after the read committed.
 */
final readonly class ReadShareController
{
    public function __invoke(ReadShareRequest $request, ReadPermits $permits, ActorStore $actors, CommandBus $bus, SharedPageResponses $responses): Response
    {
        try {
            $permit = $permits->issue($request->token());
            $page = $actors->actAsSystem(fn () => $bus->run(new ReadShare($permit->reference, $request->sharePath(), $request->cursor(), $request->wantsHeadOnly())));
        } finally {
            $permits->clear();
        }

        return $responses->page($page);
    }
}
