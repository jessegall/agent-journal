<?php

declare(strict_types=1);

namespace App\Web\Http\Controllers\Terminal;

use App\Http\Requests\Agents\TerminalViewRequest;
use App\Http\Responses\Processes\ReviewResponses;
use Illuminate\Http\RedirectResponse;

/**
 * The viewer opens their view of the agent's terminal from its page; a refusal is shown on the page.
 */
final readonly class OpenTerminalPageController
{
    public function __invoke(TerminalViewRequest $request, ReviewResponses $review): RedirectResponse
    {
        return $review->run($request->openCommand());
    }
}
