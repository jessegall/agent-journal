<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\AbandonNavigation;
use App\Agents\Enums\RequestOutcome;
use App\Agents\Exceptions\NavigationAnswerRefused;
use App\Agents\Exceptions\NavigationRaiseRefused;
use App\Agents\Exceptions\NavigationTransitionRefused;
use App\Agents\Models\DriverRequest;
use App\Agents\Support\NavigationAnswering;
use App\Contracts\CommandHandler;

/**
 * Ends a navigation request the main agent gave up on: abandoned with its reason, its queued rounds cancelled and its
 * key script ended entry_unavailable; the runtime keeps its navigation hold, which only a person clears.
 */
final readonly class AbandonNavigationHandler implements CommandHandler
{
    public function __construct(private NavigationAnswering $answering) {}

    /**
     * @throws NavigationAnswerRefused
     * @throws NavigationRaiseRefused
     * @throws NavigationTransitionRefused
     */
    public function handle(AbandonNavigation $command): void
    {
        $navigation = $this->answering->lockedForAnswerer($command->navigationId);
        $this->answering->checkVersion($navigation, $command->expectedRowVersion);

        $navigation->abandon($command->reason);
        DriverRequest::query()
            ->whereKey($navigation->driver_request_id)
            ->lockForUpdate()
            ->firstOrFail()
            ->fail(RequestOutcome::EntryUnavailable);
    }
}
