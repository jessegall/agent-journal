<?php

declare(strict_types=1);

namespace App\Web\Resolvers;

use App\Agents\Support\TerminalFrames;
use App\Http\Requests\Agents\TerminalFrameRequest;
use App\Ui\Contracts\PageResolver;
use App\Web\Data\TerminalWindowData;
use Spatie\LaravelData\Optional;

/**
 * An agent's terminal page, reloaded by the page itself: once the id of the read interest its open request opened, then
 * the newest frame of that interest after the epoch and sequence it holds. It reads only; opening, renewing and closing
 * the interest are the page's actions.
 */
final readonly class TerminalWindowResolver implements PageResolver
{
    public function __construct(private TerminalFrameRequest $request, private TerminalFrames $frames) {}

    public function read(): TerminalWindowData
    {
        $agentId = $this->request->agentId();

        if ($this->request->namesOpenRequest()) {
            $readInterestId = $this->frames->interestOpenedBy($agentId, $this->request->openRequestId());

            return new TerminalWindowData($agentId, $readInterestId);
        }

        if (! $this->request->namesInterest()) {
            return new TerminalWindowData($agentId);
        }

        $frame = $this->frames->after(
            $agentId,
            $this->request->readInterestId(),
            $this->request->heldEpoch(),
            $this->request->heldSequence(),
        );

        return new TerminalWindowData($agentId, frame: $frame->getOrElse(Optional::create()));
    }
}
