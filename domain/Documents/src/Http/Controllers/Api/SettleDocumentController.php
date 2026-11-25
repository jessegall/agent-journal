<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers\Api;

use App\Contracts\Bus\CommandBus;
use App\Support\RecordReference;
use App\Values\ApiAccepted;
use Domain\Documents\Api\SettleDocumentPayload;
use Domain\Documents\Commands\SettleDocument\SettleDocumentCommand;

/**
 * Settles a document.
 */
final readonly class SettleDocumentController
{
    public function __invoke(SettleDocumentPayload $call, CommandBus $commands): ApiAccepted
    {
        $commands->run(
            new SettleDocumentCommand(RecordReference::number($call->number), $call->revision, $call->reason),
        );

        return new ApiAccepted();
    }
}
