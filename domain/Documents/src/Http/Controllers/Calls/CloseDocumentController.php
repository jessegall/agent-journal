<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers\Calls;

use App\Contracts\Bus\CommandBus;
use Domain\Documents\Calls\CloseDocumentCall;
use Domain\Documents\Calls\DraftClosed;
use Domain\Documents\Commands\CloseDocument\CloseDocumentCommand;

/**
 * Closes the draft and answers the revision it left.
 */
final readonly class CloseDocumentController
{
    public function __invoke(CloseDocumentCall $call, CommandBus $commands): DraftClosed
    {
        $closed = $commands->run(new CloseDocumentCommand($call->target()));

        return DraftClosed::from(['revisionNumber' => $closed->revisionNumber, 'published' => $closed->published]);
    }
}
