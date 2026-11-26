<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers\Api;

use App\Attributes\Bus\Dispatches;
use App\Contracts\Bus\CommandBus;
use Domain\Documents\Api\CloseDocumentPayload;
use Domain\Documents\Api\DraftClosed;
use Domain\Documents\Commands\CloseDocument\CloseDocumentCommand;

/**
 * Closes the draft and answers the revision it left.
 */
final readonly class CloseDocumentController
{
    #[Dispatches(CloseDocumentCommand::class)]
    public function __invoke(CloseDocumentPayload $call, CommandBus $commands): DraftClosed
    {
        $closed = $commands->run(new CloseDocumentCommand($call->target()));

        return DraftClosed::from(['revisionNumber' => $closed->revisionNumber, 'isPublished' => $closed->isPublished]);
    }
}
