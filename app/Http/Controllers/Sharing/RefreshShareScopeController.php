<?php

declare(strict_types=1);

namespace App\Http\Controllers\Sharing;

use App\Bus\Attributes\Dispatches;
use App\Http\Requests\Sharing\RefreshShareScopeRequest;
use App\Sharing\Commands\RefreshShareScope\RefreshShareScopeCommand;
use App\Sharing\Support\ShareOpener;
use Illuminate\Http\RedirectResponse;

/**
 * Replaces a share's members with the owner's saved preview through the bus and opens the share's page.
 */
final readonly class RefreshShareScopeController
{
    #[Dispatches(RefreshShareScopeCommand::class)]
    public function __invoke(RefreshShareScopeRequest $request, ShareOpener $shares): RedirectResponse
    {
        return $shares->refreshScope($request->command());
    }
}
