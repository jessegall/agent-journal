<?php

declare(strict_types=1);

namespace App\Web\Resolvers;

use App\Agents\Support\TerminalFrames;
use App\Http\Requests\Agents\TerminalFrameRequest;
use App\Ui\Contracts\PageResolver;
use App\Web\Data\TerminalWindowData;
use Spatie\LaravelData\Optional;

/**
 * An agent's terminal page, reloaded by the page itself: the newest frame after the epoch and sequence the viewer
 * holds. It reads only; opening, renewing and closing the view are the page's actions.
 */
final readonly class TerminalWindowResolver implements PageResolver
{
    public function __construct(private TerminalFrameRequest $request, private TerminalFrames $frames) {}

    public function read(): TerminalWindowData
    {
        $agentId = $this->request->agentId();
        $frame = $this->frames->after($agentId, $this->request->heldEpoch(), $this->request->heldSequence());

        return new TerminalWindowData($agentId, $frame->getOrElse(Optional::create()));
    }
}
