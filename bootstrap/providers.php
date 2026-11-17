<?php

declare(strict_types=1);

use App\Core\Actors\Providers\ActorsServiceProvider;
use App\Core\Agents\Providers\AgentsServiceProvider;
use App\Core\Assignments\Providers\AssignmentsServiceProvider;
use App\Core\Hooks\Providers\HooksServiceProvider;
use App\Core\Providers\CoreServiceProvider;
use App\Domain\Access\Providers\AccessServiceProvider;
use App\Domain\Chat\Providers\ChatServiceProvider;
use App\Domain\Memory\Providers\MemoryServiceProvider;
use App\Domain\Plans\Providers\PlansServiceProvider;
use App\Domain\Processes\Providers\ProcessesServiceProvider;
use App\Domain\Providers\DomainServiceProvider;
use App\Domain\Rules\Providers\RulesServiceProvider;
use App\Domain\Sequences\Providers\SequencesServiceProvider;
use App\Domain\Tasks\Providers\TasksServiceProvider;
use App\Domain\Web\Providers\TypeScriptServiceProvider;
use App\Domain\Web\Providers\WebServiceProvider;
use App\Providers\AppServiceProvider;

return [
    AppServiceProvider::class,
    DomainServiceProvider::class,
    CoreServiceProvider::class,
    ActorsServiceProvider::class,
    AgentsServiceProvider::class,
    AssignmentsServiceProvider::class,
    HooksServiceProvider::class,
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
