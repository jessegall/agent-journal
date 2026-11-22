<?php

declare(strict_types=1);

namespace App\Communication\Commands\AcknowledgePresentation;

use App\Actors\Support\ActorIdentity;
use App\Communication\Support\PresentationAcknowledgement;
use App\Contracts\CommandHandler;
use Carbon\CarbonImmutable;

final readonly class AcknowledgePresentationHandler implements CommandHandler
{
    public function __construct(private PresentationAcknowledgement $acknowledgement) {}

    public function handle(AcknowledgePresentationCommand $command): int
    {
        return $this->acknowledgement->acknowledge(
            $command->batchId,
            $command->handles,
            $command->contextKey,
            ActorIdentity::of($command->dispatchedBy()),
            CarbonImmutable::now(),
        );
    }
}
