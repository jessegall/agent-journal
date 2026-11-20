<?php

declare(strict_types=1);

use App\Actors\Providers\ActorsServiceProvider;
use App\Agents\Providers\AgentsServiceProvider;
use App\Assignments\Providers\AssignmentsServiceProvider;
use App\Bus\Providers\CommandBusServiceProvider;
use App\Comments\Providers\CommentsServiceProvider;
use App\Communication\Providers\CommunicationServiceProvider;
use App\Desks\Providers\DesksServiceProvider;
use App\Domains\Providers\DomainEventServiceProvider;
use App\Domains\Providers\DomainServiceProvider;
use App\Engine\Providers\EngineServiceProvider;
use App\Hooks\Providers\HooksServiceProvider;
use App\Mcp\Providers\McpServiceProvider;
use App\Numbers\Providers\NumbersServiceProvider;
use App\Processes\Providers\ProcessesServiceProvider;
use App\Profiles\Providers\ProfilesServiceProvider;
use App\Providers\AppServiceProvider;
use App\Providers\CoreServiceProvider;
use App\Reads\Providers\ReadsServiceProvider;
use App\Records\Providers\RecordsServiceProvider;
use App\Settings\Providers\SettingsServiceProvider;
use App\Sharing\Providers\SharingServiceProvider;
use App\Skills\Providers\SkillsServiceProvider;
use App\Supervision\Providers\SupervisionServiceProvider;
use App\Text\Providers\TextServiceProvider;
use App\Web\Providers\TypeScriptServiceProvider;
use App\Web\Providers\WebServiceProvider;
use Domain\Access\Providers\AccessServiceProvider;
use Domain\Chat\Providers\ChatServiceProvider;
use Domain\Documents\Providers\DocumentsServiceProvider;
use Domain\Helpers\Providers\HelpersServiceProvider;
use Domain\Memory\Providers\MemoryServiceProvider;
use Domain\Plans\Providers\PlansServiceProvider;
use Domain\Rules\Providers\RulesServiceProvider;
use Domain\Sequences\Providers\SequencesServiceProvider;
use Domain\Tasks\Providers\TasksServiceProvider;

return [
    AppServiceProvider::class,
    DomainServiceProvider::class,
    SkillsServiceProvider::class,
    DomainEventServiceProvider::class,
    CoreServiceProvider::class,
    ProfilesServiceProvider::class,
    SupervisionServiceProvider::class,
    ActorsServiceProvider::class,
    AgentsServiceProvider::class,
    AssignmentsServiceProvider::class,
    RecordsServiceProvider::class,
    SharingServiceProvider::class,
    CommunicationServiceProvider::class,
    DesksServiceProvider::class,
    CommentsServiceProvider::class,
    TextServiceProvider::class,
    HooksServiceProvider::class,
    McpServiceProvider::class,
    CommandBusServiceProvider::class,
    EngineServiceProvider::class,
    ReadsServiceProvider::class,
    NumbersServiceProvider::class,
    SettingsServiceProvider::class,
    ProcessesServiceProvider::class,
    TasksServiceProvider::class,
    PlansServiceProvider::class,
    DocumentsServiceProvider::class,
    ChatServiceProvider::class,
    HelpersServiceProvider::class,
    MemoryServiceProvider::class,
    RulesServiceProvider::class,
    SequencesServiceProvider::class,
    AccessServiceProvider::class,
    WebServiceProvider::class,
    TypeScriptServiceProvider::class,
];
