<?php

declare(strict_types=1);

namespace Domain\Sharing\Http\Controllers;

use App\Attributes\Bus\Dispatches;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Records\RecordResolver;
use Domain\Sharing\Commands\SaveSharePreview\SaveSharePreviewCommand;
use Domain\Sharing\Http\Requests\SaveSharePreviewRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Saves the owner's share preview through the bus and returns to the preview page, which shows it.
 */
final readonly class SharePreviewController
{
    #[Dispatches(SaveSharePreviewCommand::class)]
    public function __invoke(
        SaveSharePreviewRequest $request,
        RecordResolver $records,
        CommandBus $commands,
        Redirector $redirect,
    ): RedirectResponse {
        $root = $request->shareRoot($records);
        $commands->run(new SaveSharePreviewCommand($root->type, $root->id, $request->selectedIds()));

        return $redirect->back(303);
    }
}
