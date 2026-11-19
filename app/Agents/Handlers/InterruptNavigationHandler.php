<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\InterruptNavigation;
use App\Agents\Enums\HoldReason;
use App\Agents\Enums\NavigationState;
use App\Agents\Exceptions\HostReportRefused;
use App\Agents\Exceptions\NavigationRaiseRefused;
use App\Agents\Models\NavigationRequest;
use App\Agents\Support\HostRuntimes;
use App\Contracts\CommandHandler;

/**
 * Interrupts a navigation request the person took over: its key script stays stopped at its step for the person to
 * resume or cancel, and the runtime is held for the person. A request already interrupted is left as it is.
 */
final readonly class InterruptNavigationHandler implements CommandHandler
{
    public function __construct(private HostRuntimes $runtimes) {}

    /**
     * @throws HostReportRefused
     * @throws NavigationRaiseRefused
     */
    public function handle(InterruptNavigation $command): void
    {
        $navigation = NavigationRequest::query()
            ->acrossActors()
            ->whereKey($command->navigationId)
            ->with('driverRequest')
            ->lockForUpdate()
            ->first()
            ?? throw NavigationRaiseRefused::unknownRequest($command->navigationId);
        $runtime = $this->runtimes->lockedFor($command->hostId, $navigation->agent_runtime_id);
        if ($navigation->state === NavigationState::Interrupted) {
            return;
        }

        $navigation->interrupt();
        $navigation->driverRequest->hold(HoldReason::NeedsAttention);
        $runtime->holdFor(HoldReason::NeedsAttention);
    }
}
