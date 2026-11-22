<?php

declare(strict_types=1);

namespace App\Supervision\Commands\RouteAsk;

use App\Contracts\CommandHandler;
use App\Supervision\Enums\AskRouteStatus;
use App\Supervision\Support\AskRecords;
use App\Supervision\Support\AskRouter;

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
