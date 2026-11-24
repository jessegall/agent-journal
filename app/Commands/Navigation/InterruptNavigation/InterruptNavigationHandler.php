<?php

declare(strict_types=1);

namespace App\Commands\Navigation\InterruptNavigation;

use App\Contracts\Bus\CommandHandler;
use App\Enums\HoldReason;
use App\Enums\NavigationState;
use App\Exceptions\HostReportRefused;
use App\Exceptions\NavigationRaiseRefused;
use App\Models\Drivers\NavigationRequest;
use App\Support\DriverRequestEndings;
use App\Support\HostRuntimes;

/**
 * Interrupts a navigation request the user took over: its key script stays stopped at its step for the user to
 * resume or cancel, and the runtime is held for the user. A request already interrupted is left as it is.
 */
final readonly class InterruptNavigationHandler implements CommandHandler
{
    public function __construct(private HostRuntimes $runtimes, private DriverRequestEndings $endings) {}

    /**
     * @throws HostReportRefused
     * @throws NavigationRaiseRefused
     */
    public function handle(InterruptNavigationCommand $command): void
    {
        $navigation = NavigationRequest::query()
            ->acrossActors()
            ->whereKey($command->navigationId)
            ->with('driverRequest')
            ->lockForUpdate()
            ->firstOr(fn () => throw NavigationRaiseRefused::unknownRequest($command->navigationId));

        $runtime = $this->runtimes->lockedFor($command->hostId, $navigation->agent_runtime_id);

        if ($navigation->state === NavigationState::Interrupted) {
            return;
        }

        $this->endings->interrupt($navigation);
        $navigation->driverRequest->hold(HoldReason::NeedsAttention);
        $runtime->holdFor(HoldReason::NeedsAttention);
    }
}
