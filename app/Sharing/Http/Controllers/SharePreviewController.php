<?php

declare(strict_types=1);

namespace App\Sharing\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Sharing\SaveSharePreviewRequest;
use App\Records\Contracts\RecordResolver;
use App\Sharing\Commands\SaveSharePreview;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Saves the owner's share preview through the bus and returns to the preview page, which shows it.
 */
final readonly class SharePreviewController
{
    public function __invoke(SaveSharePreviewRequest $request, RecordResolver $records, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $root = $request->shareRoot($records);
        $commands->run(new SaveSharePreview($root->type, $root->id, $request->selectedIds()));

        return $redirect->back(303);
    }
}
