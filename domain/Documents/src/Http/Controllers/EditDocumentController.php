<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use Domain\Documents\Commands\ChangeDocumentDetails;
use Domain\Documents\Commands\ReplaceDocumentBody;
use Domain\Documents\Commands\ReplaceDocumentSection;
use Domain\Documents\Commands\ReplaceDocumentText;
use Domain\Documents\Http\Requests\DraftRequest;
use Illuminate\Http\JsonResponse;

/**
 * One draft edit: the whole body, one section, one exact piece of text, or the title and abstract.
 */
final readonly class EditDocumentController
{
    public function __invoke(DraftRequest $request, CommandBus $commands): JsonResponse
    {
        $target = $request->target();
        $command = match ($request->mode()) {
            'section' => new ReplaceDocumentSection($target, $request->section(), $request->text('body')),
            'text' => new ReplaceDocumentText($target, $request->text('old'), $request->text('new')),
            'details' => new ChangeDocumentDetails($target, $request->text('title'), $request->text('abstract')),
            default => new ReplaceDocumentBody($target, $request->text('body')),
        };

        return new JsonResponse($commands->run($command));
    }
}
