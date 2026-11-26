<?php

declare(strict_types=1);

namespace App\Commands\Navigation\AbandonNavigation;

use App\Contracts\Bus\CommandHandler;
use App\Enums\Drivers\RequestOutcome;
use App\Exceptions\NavigationAnswerRefused;
use App\Exceptions\NavigationRaiseRefused;
use App\Exceptions\NavigationTransitionRefused;
use App\Models\Drivers\DriverRequest;
use App\Support\DriverRequestEndings;
use App\Support\NavigationAnswerCheck;

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
    public function handle(AbandonNavigationCommand $command): string
    {
        $navigation = $this->answering->lockedForAnswerer($command->navigationId);
        $this->answering->assertCurrentVersion($navigation, $command->expectedRowVersion);

        $this->endings->abandon($navigation, $command->reason);

        DriverRequest::query()
            ->whereKey($navigation->driver_request_id)
            ->lockForUpdate()
            ->firstOrFail()
            ->fail(RequestOutcome::EntryUnavailable);

        return $navigation->getKey();
    }
}
