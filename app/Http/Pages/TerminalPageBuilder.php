<?php

declare(strict_types=1);

namespace App\Http\Pages;

use App\Http\Requests\Agents\TerminalFrameRequest;
use App\Reads\PageFormRequests;
use App\Terminals\Data\TerminalWindowData;
use App\Web\Creation\Contracts\PageBuilder;
use Illuminate\Http\Request;

/**
 * An agent's terminal page: only the agent; the page's terminal controller opens, renews, reads and closes its read
 * interest through the terminal's JSON actions.
 */
final readonly class TerminalPageBuilder implements PageBuilder
{
    public function __construct(private PageFormRequests $requests) {}

    public function build(Request $visit): TerminalWindowData
    {
        $input = $this->requests->forVisit(TerminalFrameRequest::class, $visit);

        return TerminalWindowData::build()->agentId($input->agentId())->finish();
    }
}
