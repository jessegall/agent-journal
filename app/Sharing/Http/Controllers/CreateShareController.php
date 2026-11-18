<?php

declare(strict_types=1);

namespace App\Sharing\Http\Controllers;

use App\Http\Requests\Sharing\CreateShareRequest;
use App\Sharing\Http\Support\ShareOpener;
use Illuminate\Http\RedirectResponse;

/**
 * Confirms the owner's saved preview into a share through the bus and opens the new share's page.
 */
final readonly class CreateShareController
{
    public function __invoke(CreateShareRequest $request, ShareOpener $shares): RedirectResponse
    {
        return $shares->create($request->command());
    }
}
