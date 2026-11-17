<?php

declare(strict_types=1);

use App\Domain\Agents\AgentsServiceProvider;
use App\Domain\DomainServiceProvider;
use App\Domain\Hooks\HooksServiceProvider;
use App\Domain\Processes\ProcessesServiceProvider;
use App\Providers\AppServiceProvider;
use App\Providers\FortifyServiceProvider;

return [
    AppServiceProvider::class,
    DomainServiceProvider::class,
    AgentsServiceProvider::class,
    HooksServiceProvider::class,
    ProcessesServiceProvider::class,
    FortifyServiceProvider::class,
];
