<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Contracts\Events\Listener;
use App\Events\Sessions\StartRefused;
use App\Models\Agents\Agent;
use App\Models\Messages\Message;
use App\Sessions\StartRefusalCodes;
use Carbon\CarbonImmutable;

/**
 * A start of an agent refused for good gives up the delivery of every message still waiting for that agent, with the
 * refusal's words as the reason, so each shows Not delivered with Retry.
 */
final readonly class FailWaitingDeliveries implements Listener
{
    /**
     * The most waiting messages one refusal gives up on.
     */
    public const int MOST_FAILED = 100;

    public function handle(StartRefused $event): void
    {
        $agent = Agent::query()->findOrFail($event->agentId);
        $reason = StartRefusalCodes::reasonOf($event->refusal)->explanation();
        $at = CarbonImmutable::instance($event->occurredAt);

        Message::query()->unreadBy($agent)->awaitingDelivery()->limit(self::MOST_FAILED)->get()
            ->each(fn (Message $message) => $message->failDelivery($reason, $at));
    }
}
