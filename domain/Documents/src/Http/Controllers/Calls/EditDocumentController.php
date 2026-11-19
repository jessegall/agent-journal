<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use Domain\Documents\Calls\DraftHeld;
use Domain\Documents\Calls\EditDocumentCall;
use Domain\Documents\Commands\ChangeDocumentDetails;
use Domain\Documents\Commands\ReplaceDocumentBody;
use Domain\Documents\Commands\ReplaceDocumentSection;
use Domain\Documents\Commands\ReplaceDocumentText;

/**
 * Changes the draft as the call asks and answers it.
 */
final readonly class EditDocumentController
{
    public function __invoke(EditDocumentCall $call, CommandBus $commands): DraftHeld
    {
        $target = $call->target();
        $command = match ($call->mode) {
            'section' => new ReplaceDocumentSection($target, (string) $call->section, (string) $call->body),
            'text' => new ReplaceDocumentText($target, (string) $call->old, (string) $call->new),
            'details' => new ChangeDocumentDetails($target, (string) $call->title, (string) $call->abstract),
            default => new ReplaceDocumentBody($target, (string) $call->body),
        };
        $draft = $commands->run($command);

        return DraftHeld::from([
            'documentId' => $draft->documentId,
            'documentNumber' => $draft->documentNumber,
            'token' => $draft->token,
            'version' => $draft->version,
            'baseRevisionNumber' => $draft->baseRevisionNumber,
            'outline' => $draft->outline,
        ]);
    }
}
