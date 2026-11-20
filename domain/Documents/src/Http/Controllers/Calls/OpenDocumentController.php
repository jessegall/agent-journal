<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Numbers\Support\RecordReference;
use Domain\Documents\Calls\DraftHeld;
use Domain\Documents\Calls\OpenDocumentCall;
use Domain\Documents\Commands\OpenDocument;
use Illuminate\Support\Str;

/**
 * Opens a draft and answers it.
 */
final readonly class OpenDocumentController
{
    public function __invoke(OpenDocumentCall $call, CommandBus $commands): DraftHeld
    {
        $reference = Str::isUlid($call->number) ? $call->number : RecordReference::number($call->number);
        $draft = $commands->run(new OpenDocument($reference, $call->expectedRevision));

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
