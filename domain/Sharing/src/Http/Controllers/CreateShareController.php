<?php

declare(strict_types=1);

namespace Domain\Sharing\Http\Controllers;

use App\Attributes\Bus\Dispatches;
use Domain\Sharing\Commands\CreateShare\CreateShareCommand;
use Domain\Sharing\Http\Requests\CreateShareRequest;
use Domain\Sharing\Support\ShareOpener;
use Illuminate\Http\RedirectResponse;

/**
 * Confirms the owner's saved preview into a share through the bus and opens the new share's page.
 */
final readonly class CreateShareController
{
    #[Dispatches(CreateShareCommand::class)]
    public function __invoke(CreateShareRequest $request, ShareOpener $shares): RedirectResponse
    {
        return $shares->create($request->command());
    }
}
