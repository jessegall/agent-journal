<?php

declare(strict_types=1);

use App\Actors\Providers\ActorsServiceProvider;
use App\Agents\Providers\AgentsServiceProvider;
use App\Assignments\Providers\AssignmentsServiceProvider;
use App\Bus\Providers\CommandBusServiceProvider;
use App\Domains\Providers\DomainServiceProvider;
use App\Hooks\Providers\HooksServiceProvider;
use App\Providers\AppServiceProvider;
use App\Providers\CoreServiceProvider;
use App\Web\Providers\TypeScriptServiceProvider;
use App\Web\Providers\WebServiceProvider;
use Domain\Access\Providers\AccessServiceProvider;
use Domain\Chat\Providers\ChatServiceProvider;
use Domain\Memory\Providers\MemoryServiceProvider;
use Domain\Plans\Providers\PlansServiceProvider;
use Domain\Processes\Providers\ProcessesServiceProvider;
use Domain\Rules\Providers\RulesServiceProvider;
use Domain\Sequences\Providers\SequencesServiceProvider;
use Domain\Tasks\Providers\TasksServiceProvider;

return [
    AppServiceProvider::class,
    DomainServiceProvider::class,
    CoreServiceProvider::class,
    ActorsServiceProvider::class,
    AgentsServiceProvider::class,
    AssignmentsServiceProvider::class,
    HooksServiceProvider::class,
    CommandBusServiceProvider::class,
    ProcessesServiceProvider::class,
    TasksServiceProvider::class,
    PlansServiceProvider::class,
    ChatServiceProvider::class,
    MemoryServiceProvider::class,
    RulesServiceProvider::class,
    SequencesServiceProvider::class,
    AccessServiceProvider::class,
    WebServiceProvider::class,
    TypeScriptServiceProvider::class,
];
