<?php

declare(strict_types=1);
use App\Agents\AgentsDomain;
use App\Chat\ChatDomain;
use App\Hooks\HooksDomain;
use App\Links\LinksDomain;
use App\Memory\MemoryDomain;
use App\Plans\PlansDomain;
use App\Processes\ProcessesDomain;
use App\Profiles\ProfilesDomain;
use App\Reminders\RemindersDomain;
use App\Rules\RulesDomain;
use App\Sequences\SequencesDomain;
use App\Tasks\TasksDomain;

return [
    TasksDomain::class,
    PlansDomain::class,
    ChatDomain::class,
    MemoryDomain::class,
    RulesDomain::class,
    SequencesDomain::class,
    RemindersDomain::class,
    ProfilesDomain::class,
    AgentsDomain::class,
    HooksDomain::class,
    ProcessesDomain::class,
    LinksDomain::class,
];
