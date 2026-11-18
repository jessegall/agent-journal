<?php

declare(strict_types=1);

use App\Actors\Providers\ActorsServiceProvider;
use App\Agents\Providers\AgentsServiceProvider;
use App\Assignments\Providers\AssignmentsServiceProvider;
use App\Bus\Providers\CommandBusServiceProvider;
use App\Comments\Providers\CommentsServiceProvider;
use App\Communication\Providers\CommunicationServiceProvider;
use App\Domains\Providers\DomainEventServiceProvider;
use App\Domains\Providers\DomainServiceProvider;
use App\Hooks\Providers\HooksServiceProvider;
use App\Numbers\Providers\NumbersServiceProvider;
use App\Providers\AppServiceProvider;
use App\Providers\CoreServiceProvider;
use App\Reads\Providers\ReadsServiceProvider;
use App\Records\Providers\RecordsServiceProvider;
use App\Text\Providers\TextServiceProvider;
use App\Web\Providers\TypeScriptServiceProvider;
use App\Web\Providers\WebServiceProvider;
use Domain\Access\Providers\AccessServiceProvider;
use Domain\Chat\Providers\ChatServiceProvider;
use Domain\Documents\Providers\DocumentsServiceProvider;
use Domain\Memory\Providers\MemoryServiceProvider;
use Domain\Plans\Providers\PlansServiceProvider;
use Domain\Processes\Providers\ProcessesServiceProvider;
use Domain\Rules\Providers\RulesServiceProvider;
use Domain\Sequences\Providers\SequencesServiceProvider;
use Domain\Tasks\Providers\TasksServiceProvider;

return [
    AppServiceProvider::class,
    DomainServiceProvider::class,
    DomainEventServiceProvider::class,
    CoreServiceProvider::class,
    ActorsServiceProvider::class,
    AgentsServiceProvider::class,
    AssignmentsServiceProvider::class,
    RecordsServiceProvider::class,
    CommunicationServiceProvider::class,
    CommentsServiceProvider::class,
    TextServiceProvider::class,
    HooksServiceProvider::class,
    CommandBusServiceProvider::class,
    ReadsServiceProvider::class,
    NumbersServiceProvider::class,
    ProcessesServiceProvider::class,
    TasksServiceProvider::class,
    PlansServiceProvider::class,
    DocumentsServiceProvider::class,
    ChatServiceProvider::class,
    MemoryServiceProvider::class,
    RulesServiceProvider::class,
    SequencesServiceProvider::class,
    AccessServiceProvider::class,
    WebServiceProvider::class,
    TypeScriptServiceProvider::class,
];
