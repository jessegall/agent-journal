<?php

declare(strict_types=1);

use App\Core\Actors\ActorsServiceProvider;
use App\Core\Agents\AgentsServiceProvider;
use App\Core\CoreServiceProvider;
use App\Core\Hooks\HooksServiceProvider;
use App\Domain\Access\AccessServiceProvider;
use App\Domain\DomainServiceProvider;
use App\Domain\Processes\ProcessesServiceProvider;
use App\Domain\Web\Types\TypeScriptServiceProvider;
use App\Domain\Web\WebServiceProvider;
use App\Providers\AppServiceProvider;

return [
    AppServiceProvider::class,
    DomainServiceProvider::class,
    CoreServiceProvider::class,
    ActorsServiceProvider::class,
    AgentsServiceProvider::class,
    HooksServiceProvider::class,
    ProcessesServiceProvider::class,
    AccessServiceProvider::class,
    WebServiceProvider::class,
    TypeScriptServiceProvider::class,
];
