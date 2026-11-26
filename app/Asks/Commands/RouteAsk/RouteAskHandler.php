<?php

declare(strict_types=1);

namespace App\Asks\Commands\RouteAsk;

use App\Asks\AskRecords;
use App\Asks\AskRouter;
use App\Asks\Enums\AskRouteStatus;
use App\Bus\Contracts\CommandHandler;

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
