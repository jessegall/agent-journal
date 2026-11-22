<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers\Calls;

use App\AgentRequests\Values\CallAccepted;
use App\Bus\Contracts\CommandBus;
use App\Numbers\Support\RecordReference;
use Domain\Documents\Calls\SettleDocumentCall;
use Domain\Documents\Commands\SettleDocument\SettleDocumentCommand;

/**
 * Settles a document.
 */
final readonly class SettleDocumentController
{
    public function __invoke(SettleDocumentCall $call, CommandBus $commands): CallAccepted
    {
        $commands->run(new SettleDocumentCommand(RecordReference::number($call->number), $call->revision, $call->reason));

        return new CallAccepted();
    }
}
