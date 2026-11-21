<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Enums\RequestProgress;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\DriverRequest;
use App\Agents\Models\NavigationRequest;

/**
 * Ends driver requests and the navigation tied to them in one transaction: a cancelled or settled request cancels its
 * open navigation, and an ended navigation cancels the rounds it queued that have not reached the host yet.
 */
final readonly class DriverRequestEndings
{
    public function cancel(DriverRequest $request): void
    {
        $request->cancel();
        $this->cancelNavigationOf($request);
    }

    /**
     * Its runtime's process ended for good: the request's navigation ends, then the request settles.
     */
    public function settleAfterExit(DriverRequest $request): void
    {
        $this->cancelNavigationOf($request);
        $request->settleAfterExit();
    }

    /**
     * The runtime's process exited: it stops, and every open request it had gets its final outcome.
     */
    public function closeAfterExit(AgentRuntime $runtime): void
    {
        $runtime->closeAfterExit();
        $open = $runtime->requests()
            ->whereIn('progress', RequestProgress::open())
            ->readAll('every open request of a runtime that exited gets its final outcome')
            ->get();

        foreach ($open as $request) {
            $this->settleAfterExit($request);
        }
    }

    public function abandon(NavigationRequest $navigation, string $reason): void
    {
        $navigation->abandon($reason);
        $this->cancelQueuedRoundsOf($navigation);
    }

    public function interrupt(NavigationRequest $navigation): void
    {
        $navigation->interrupt();
        $this->cancelQueuedRoundsOf($navigation);
    }

    public function expire(NavigationRequest $navigation): void
    {
        $navigation->expire();
        $this->cancelQueuedRoundsOf($navigation);
    }

    private function cancelNavigationOf(DriverRequest $request): void
    {
        $open = NavigationRequest::query()
            ->acrossActors()
            ->open()
            ->where('driver_request_id', $request->id)
            ->lockForUpdate()
            ->first();

        if ($open === null) {
            return;
        }

        $open->cancel();
        $this->cancelQueuedRoundsOf($open);
    }

    /**
     * Cancels the main agent's rounds that have not reached the host yet: the request they answer has ended.
     */
    private function cancelQueuedRoundsOf(NavigationRequest $navigation): void
    {
        $queued = DriverRequest::query()
            ->where('navigation_request_id', $navigation->id)
            ->whereIn('progress', [RequestProgress::Accepted, RequestProgress::Staged])
            ->lockForUpdate()
            ->limit(20)
            ->get();

        foreach ($queued as $round) {
            $this->cancel($round);
        }
    }
}
