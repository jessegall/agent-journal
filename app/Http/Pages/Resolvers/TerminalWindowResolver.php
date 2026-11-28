<?php

declare(strict_types=1);

namespace App\Http\Pages\Resolvers;

use App\Http\Requests\Agents\TerminalFrameRequest;
use App\Navigation\Contracts\PageResolver;
use App\Terminals\Data\TerminalWindowData;

/**
 * An agent's terminal page: only the agent; the page's terminal controller opens, renews, reads and closes its read
 * interest through the terminal's JSON actions.
 */
final readonly class TerminalWindowResolver implements PageResolver
{
    public function __construct(private TerminalFrameRequest $request) {}

    public function read(): TerminalWindowData
    {
        return TerminalWindowData::build()->agentId($this->request->agentId())->finish();
    }
}
