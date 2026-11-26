<?php

declare(strict_types=1);

namespace Domain\Sharing\Http\Controllers;

use App\Bus\Attributes\Dispatches;
use Domain\Sharing\Commands\RefreshShareScope\RefreshShareScopeCommand;
use Domain\Sharing\Http\Requests\RefreshShareScopeRequest;
use Domain\Sharing\Support\ShareOpener;
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
