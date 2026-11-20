<?php

declare(strict_types=1);

namespace App\Supervision\Listeners;

use App\Bus\Contracts\CommandBus;
use App\Contracts\Listener;
use App\Hooks\Events\HelperStopHeld;
use App\Hooks\Models\StopAttempt;
use App\Supervision\Commands\RouteAsk;
use App\Supervision\Enums\AskOriginType;
use App\Supervision\Enums\CoreAskType;
use App\Supervision\Support\AskOpening;
use App\Supervision\Support\AskTypeRegistry;

/**
 * A helper whose stop was held after repeated unchanged failures asks its stuck route for help, once per held stop.
 */
final readonly class OpenStuckAsk implements Listener
{
    private const string BODY = 'My stop was held after the same checks failed three times; I need help to go on.';

    public function __construct(
        private AskTypeRegistry $types,
        private AskOpening $opening,
        private CommandBus $commands,
    ) {}

    public function handle(HelperStopHeld $event): void
    {
        $ask = $this->opening->open(
            StopAttempt::agentOf($event->attempt),
            $this->types->get(CoreAskType::Stuck->key()),
            "stop-held:{$event->attempt->attemptId}",
            self::BODY,
            $event->work,
            AskOriginType::Internal,
        );

        if ($ask->open && $ask->version === 0) {
            $this->commands->run(new RouteAsk($ask->reference(), 0));
        }
    }
}
