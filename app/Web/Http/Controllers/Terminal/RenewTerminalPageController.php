<?php

declare(strict_types=1);

namespace App\Web\Http\Controllers\Terminal;

use App\Http\Requests\Agents\TerminalViewRequest;
use App\Http\Responses\Processes\ReviewResponses;
use Illuminate\Http\RedirectResponse;

/**
 * The terminal page keeps its view open; a refusal is shown on the page.
 */
final readonly class RenewTerminalPageController
{
    public function __invoke(TerminalViewRequest $request, ReviewResponses $review): RedirectResponse
    {
        return $review->run($request->renewCommand());
    }
}
