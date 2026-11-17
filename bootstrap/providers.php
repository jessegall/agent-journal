<?php

declare(strict_types=1);

use App\Core\Actors\ActorsServiceProvider;
use App\Core\Agents\AgentsServiceProvider;
use App\Core\CoreServiceProvider;
use App\Core\Hooks\HooksServiceProvider;
use App\Domain\Access\AccessServiceProvider;
use App\Domain\Chat\ChatServiceProvider;
use App\Domain\DomainServiceProvider;
use App\Domain\Memory\MemoryServiceProvider;
use App\Domain\Plans\PlansServiceProvider;
use App\Domain\Processes\ProcessesServiceProvider;
use App\Domain\Rules\RulesServiceProvider;
use App\Domain\Sequences\SequencesServiceProvider;
use App\Domain\Tasks\TasksServiceProvider;
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
