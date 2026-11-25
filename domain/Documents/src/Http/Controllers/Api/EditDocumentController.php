<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers\Api;

use App\Attributes\Bus\Dispatches;
use App\Contracts\Bus\CommandBus;
use Domain\Documents\Api\DraftHeld;
use Domain\Documents\Api\EditDocumentPayload;
use Domain\Documents\Commands\ChangeDocumentDetails\ChangeDocumentDetailsCommand;
use Domain\Documents\Commands\EditDocument\EditDocumentCommand;
use Domain\Documents\Commands\ReplaceDocumentBody\ReplaceDocumentBodyCommand;
use Domain\Documents\Commands\ReplaceDocumentText\ReplaceDocumentTextCommand;

/**
 * Changes the draft as the call asks and answers it.
 */
final readonly class EditDocumentController
{
    #[Dispatches(ChangeDocumentDetailsCommand::class)]
    #[Dispatches(EditDocumentCommand::class)]
    #[Dispatches(ReplaceDocumentBodyCommand::class)]
    #[Dispatches(ReplaceDocumentTextCommand::class)]
    public function __invoke(EditDocumentPayload $call, CommandBus $commands): DraftHeld
    {
        $target = $call->target();

        $command = match ($call->mode) {
            'section' => new EditDocumentCommand($target, (string) $call->section, $call->body, $call->uploadId),
            'text' => new ReplaceDocumentTextCommand(
                $target,
                (string) $call->originalText,
                (string) $call->replacementText,
            ),
            'details' => new ChangeDocumentDetailsCommand($target, (string) $call->title, (string) $call->abstract),
            default => new ReplaceDocumentBodyCommand($target, (string) $call->body),
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
