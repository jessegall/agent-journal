<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\Sharing\RefreshShareScopeRequest;
use App\Support\ShareOpener;
use Illuminate\Http\RedirectResponse;

/**
 * Replaces a share's members with the owner's saved preview through the bus and opens the share's page.
 */
final readonly class RefreshShareScopeController
{
    public function __invoke(RefreshShareScopeRequest $request, ShareOpener $shares): RedirectResponse
    {
        return $shares->refreshScope($request->command());
    }
}
