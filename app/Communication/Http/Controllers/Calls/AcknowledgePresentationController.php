<?php

declare(strict_types=1);

namespace App\Communication\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Communication\Calls\AcknowledgePresentationCall;
use App\Communication\Calls\PresentationAcknowledged;
use App\Communication\Commands\AcknowledgePresentation;

/**
 * Confirms the pieces of a presentation batch your driver showed.
 */
final readonly class AcknowledgePresentationController
{
    public function __invoke(AcknowledgePresentationCall $call, CommandBus $commands): PresentationAcknowledged
    {
        $confirmed = $commands->run(new AcknowledgePresentation(
            $call->batchId,
            $call->handles,
            $call->contextKey,
        ));

        return PresentationAcknowledged::from(['batchId' => $call->batchId, 'confirmed' => $confirmed]);
    }
}
