<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Asks\AskService;
use App\Asks\AskTypeRegistry;
use App\Asks\Commands\RouteAsk\RouteAskCommand;
use App\Asks\Enums\AskOriginType;
use App\Asks\Enums\CoreAskType;
use App\Bus\Contracts\CommandBus;
use App\Contracts\Events\Listener;
use App\Events\Hooks\StopCheckHeld;
use App\Models\Sessions\StopCheck;

/**
 * An agent whose stop was held after repeated unchanged failures asks its stuck route for help, once per held stop.
 */
final readonly class OpenStuckAsk implements Listener
{
    private const string BODY = 'My stop was held after the same checks failed three times; I need help to go on.';

    public function __construct(
        private AskTypeRegistry $types,
        private AskService $opening,
        private CommandBus $commands,
    ) {}

    public function handle(StopCheckHeld $event): void
    {
        $ask = $this->opening->open(
            StopCheck::resolveAgentOf($event->attempt),
            $this->types->get(CoreAskType::Stuck->key()),
            "stop-held:{$event->attempt->attemptId}",
            self::BODY,
            $event->work,
            AskOriginType::Internal,
        );

        if ($ask->open && $ask->version === 0) {
            $this->commands->run(new RouteAskCommand($ask->reference, 0));
        }
    }
}
