<?php

declare(strict_types=1);

namespace App\Commands\Asks\RouteAsk;

use App\Contracts\Bus\CommandHandler;
use App\Enums\AskRouteStatus;
use App\Support\AskRecords;
use App\Support\AskRouter;

final readonly class RouteAskHandler implements CommandHandler
{
    public function __construct(
        private AskRecords $asks,
        private AskRouter $router,
    ) {}

    public function handle(RouteAskCommand $command): AskRouteStatus
    {
        return $this->router->route($this->asks->read($command->ask), $command->expectedVersion, $command->current);
    }
}
