<?php

declare(strict_types=1);

use App\Core\Agents\AgentsServiceProvider;
use App\Core\CoreServiceProvider;
use App\Core\Hooks\HooksServiceProvider;
use App\Domain\DomainServiceProvider;
use App\Domain\Processes\ProcessesServiceProvider;
use App\Providers\AppServiceProvider;
use App\Providers\FortifyServiceProvider;

return [
    AppServiceProvider::class,
    DomainServiceProvider::class,
    CoreServiceProvider::class,
    AgentsServiceProvider::class,
    HooksServiceProvider::class,
    ProcessesServiceProvider::class,
    FortifyServiceProvider::class,
];
