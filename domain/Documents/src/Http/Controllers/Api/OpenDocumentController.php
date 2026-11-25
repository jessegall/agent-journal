<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers\Api;

use App\Contracts\Bus\CommandBus;
use Domain\Documents\Api\DraftHeld;
use Domain\Documents\Api\OpenDocumentPayload;
use Domain\Documents\Commands\OpenDocument\OpenDocumentCommand;

/**
 * Opens a draft and answers it.
 */
final readonly class OpenDocumentController
{
    public function __invoke(OpenDocumentPayload $call, CommandBus $commands): DraftHeld
    {
        $draft = $commands->run(new OpenDocumentCommand($call->number, $call->expectedRevision));

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
