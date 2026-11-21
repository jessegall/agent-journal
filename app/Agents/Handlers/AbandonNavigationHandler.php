<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\AbandonNavigation;
use App\Agents\Enums\RequestOutcome;
use App\Agents\Exceptions\NavigationAnswerRefused;
use App\Agents\Exceptions\NavigationRaiseRefused;
use App\Agents\Exceptions\NavigationTransitionRefused;
use App\Agents\Models\DriverRequest;
use App\Agents\Support\DriverRequestEndings;
use App\Agents\Support\NavigationAnswerCheck;
use App\Contracts\CommandHandler;

/**
 * Ends a navigation request the main agent gave up on: abandoned with its reason, its queued rounds cancelled and its
 * key script ended entry_unavailable; the runtime keeps its navigation hold, which only a user clears.
 */
final readonly class AbandonNavigationHandler implements CommandHandler
{
    public function __construct(private NavigationAnswerCheck $answering, private DriverRequestEndings $endings) {}

    /**
     * @throws NavigationAnswerRefused
     * @throws NavigationRaiseRefused
     * @throws NavigationTransitionRefused
     */
    public function handle(AbandonNavigation $command): string
    {
        $navigation = $this->answering->lockedForAnswerer($command->navigationId);
        $this->answering->assertCurrentVersion($navigation, $command->expectedRowVersion);

        $this->endings->abandon($navigation, $command->reason);

        DriverRequest::query()
            ->whereKey($navigation->driver_request_id)
            ->lockForUpdate()
            ->firstOrFail()
            ->fail(RequestOutcome::EntryUnavailable);

        return $navigation->id;
    }
}
