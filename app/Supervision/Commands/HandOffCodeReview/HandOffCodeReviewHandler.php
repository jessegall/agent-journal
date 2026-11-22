<?php

declare(strict_types=1);

namespace App\Supervision\Commands\HandOffCodeReview;

use App\Agents\Contracts\HelperCommitImport;
use App\Agents\Exceptions\HelperImportFailed;
use App\Agents\Models\WorkReservation;
use App\Assignments\Contracts\MaintenanceAdmission;
use App\Contracts\CommandHandler;
use App\Supervision\Enums\AskOriginType;
use App\Supervision\Enums\CoreAskType;
use App\Supervision\Models\CodeReview;
use App\Supervision\Support\AskOpening;
use App\Supervision\Support\AskRouter;
use App\Supervision\Support\AskTypeRegistry;

/**
 * Imports the reserved work once, then opens its one review ask and marks the reservation handed off. A failed
 * import is kept on the review with its reason for the next pass, until its attempts run out.
 */
final readonly class HandOffCodeReviewHandler implements CommandHandler
{
    public function __construct(
        private MaintenanceAdmission $access,
        private HelperCommitImport $import,
        private AskTypeRegistry $types,
        private AskOpening $opening,
        private AskRouter $router,
    ) {}

    public function handle(HandOffCodeReviewCommand $command): void
    {
        $this->access->assertMaintenanceGranted(HandOffCodeReviewCommand::MAINTENANCE_SCOPE);
        $reservation = WorkReservation::lockedFor($command->certificate);
        $review = CodeReview::retain($reservation);

        if (! $review->isAwaitingImport() || ! $review->hasImportAttemptsLeft()) {
            return;
        }

        try {
            $import = $this->import->importCertified($review->work(), $review->certificate);
        } catch (HelperImportFailed $failure) {
            $review->failImport($failure->getMessage());
            $reservation->touch();

            return;
        }

        $ask = $this->opening->open(
            $review->worker(),
            $this->types->get(CoreAskType::ReviewReady->key()),
            "code-review:{$review->certificate}",
            "Review the certified work imported under {$import->ref}: {$import->base}..{$import->head}.",
            $review->work(),
            AskOriginType::Internal,
        );

        $review->open($import, $ask);
        $this->router->route($ask, 0, null);
        $reservation->handOff();
    }
}
