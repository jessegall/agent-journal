<?php

declare(strict_types=1);

use App\Mcp\Providers\McpServiceProvider;
use App\Providers\AccessServiceProvider;
use App\Providers\ActorsServiceProvider;
use App\Providers\AgentsServiceProvider;
use App\Providers\AppServiceProvider;
use App\Providers\AssignmentsServiceProvider;
use App\Providers\CommandBusServiceProvider;
use App\Providers\CommunicationServiceProvider;
use App\Providers\ConnectionsServiceProvider;
use App\Providers\CoreServiceProvider;
use App\Providers\DomainEventServiceProvider;
use App\Providers\DomainServiceProvider;
use App\Providers\DriversServiceProvider;
use App\Providers\EngineServiceProvider;
use App\Providers\FilesServiceProvider;
use App\Providers\HooksServiceProvider;
use App\Providers\NumbersServiceProvider;
use App\Providers\ProcessesServiceProvider;
use App\Providers\ProfilesServiceProvider;
use App\Providers\ReadsServiceProvider;
use App\Providers\RecordsServiceProvider;
use App\Providers\ReflectionServiceProvider;
use App\Providers\ScriptsServiceProvider;
use App\Providers\SettingsServiceProvider;
use App\Providers\SkillsServiceProvider;
use App\Providers\SupervisionServiceProvider;
use App\Providers\TextServiceProvider;
use App\Providers\TypeScriptServiceProvider;
use App\Providers\WebServiceProvider;

return [
    AppServiceProvider::class,
    ReflectionServiceProvider::class,
    FilesServiceProvider::class,
    DomainServiceProvider::class,
    SkillsServiceProvider::class,
    DomainEventServiceProvider::class,
    CoreServiceProvider::class,
    ProfilesServiceProvider::class,
    ScriptsServiceProvider::class,
    SupervisionServiceProvider::class,
    ActorsServiceProvider::class,
    AgentsServiceProvider::class,
    AssignmentsServiceProvider::class,
    RecordsServiceProvider::class,
    DriversServiceProvider::class,
    ConnectionsServiceProvider::class,
    CommunicationServiceProvider::class,
    TextServiceProvider::class,
    HooksServiceProvider::class,
    McpServiceProvider::class,
    CommandBusServiceProvider::class,
    EngineServiceProvider::class,
    ReadsServiceProvider::class,
    NumbersServiceProvider::class,
    SettingsServiceProvider::class,
    ProcessesServiceProvider::class,
    AccessServiceProvider::class,
    WebServiceProvider::class,
    TypeScriptServiceProvider::class,
];
