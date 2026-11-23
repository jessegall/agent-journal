<?php

declare(strict_types=1);

namespace App\Support;

use App\Commands\HandOffCodeReview\HandOffCodeReviewCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Events\EngineListener;
use App\Events\EngineTicked;
use App\Models\Reviews\WorkReservation;
use Throwable;

/**
 * Hands off at most five reserved works on every engine pass, each as its own command. This is the one boundary where
 * a handoff that cannot go on is reported and skipped, so it never holds back the works after it; the next pass tries
 * it again.
 */
final readonly class HandOffCodeReviewsOnTick implements EngineListener
{
    /**
     * The most works one pass hands off.
     */
    private const int PASS_LIMIT = 5;

    public function __construct(private CommandBus $commands) {}

    public function maintenanceScope(): string
    {
        return HandOffCodeReviewCommand::MAINTENANCE_SCOPE;
    }

    public function __invoke(EngineTicked $event): void
    {
        foreach (WorkReservation::awaitingHandoff(self::PASS_LIMIT) as $reservation) {
            try {
                $this->commands->run(new HandOffCodeReviewCommand($reservation->certificate));
            } catch (Throwable $failure) {
                report($failure);
            }
        }
    }
}
