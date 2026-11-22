<?php

declare(strict_types=1);

namespace App\Commands\AcknowledgePresentation;

use App\Contracts\CommandHandler;
use App\Support\ActorIdentity;
use App\Support\PresentationAcknowledgement;
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
