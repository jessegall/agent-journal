<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Communication\AcknowledgePresentationCall;
use App\Calls\Communication\PresentationAcknowledged;
use App\Commands\AcknowledgePresentation\AcknowledgePresentationCommand;
use App\Contracts\Bus\CommandBus;

/**
 * Confirms the pieces of a presentation batch your driver showed.
 */
final readonly class AcknowledgePresentationController
{
    public function __invoke(AcknowledgePresentationCall $call, CommandBus $commands): PresentationAcknowledged
    {
        $confirmed = $commands->run(new AcknowledgePresentationCommand(
            $call->batchId,
            $call->handles,
            $call->contextKey,
        ));

        return PresentationAcknowledged::from(['batchId' => $call->batchId, 'confirmed' => $confirmed]);
    }
}
