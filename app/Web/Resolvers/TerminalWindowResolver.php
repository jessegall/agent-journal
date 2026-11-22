<?php

declare(strict_types=1);

namespace App\Web\Resolvers;

use App\Http\Requests\Agents\TerminalFrameRequest;
use App\Ui\Contracts\PageResolver;
use App\Web\Data\TerminalWindowData;

/**
 * An agent's terminal page: only the agent; the page's terminal controller opens, renews, reads and closes its read
 * interest through the terminal's JSON actions.
 */
final readonly class TerminalWindowResolver implements PageResolver
{
    public function __construct(private TerminalFrameRequest $request) {}

    public function read(): TerminalWindowData
    {
        return new TerminalWindowData($this->request->agentId());
    }
}
