<?php

declare(strict_types=1);
use App\Domain\Access\AccessDomain;
use App\Domain\Chat\ChatDomain;
use App\Domain\Memory\MemoryDomain;
use App\Domain\Plans\PlansDomain;
use App\Domain\Processes\ProcessesDomain;
use App\Domain\Profiles\ProfilesDomain;
use App\Domain\Reminders\RemindersDomain;
use App\Domain\Rules\RulesDomain;
use App\Domain\Sequences\SequencesDomain;
use App\Domain\Tasks\TasksDomain;

return [
    TasksDomain::class,
    PlansDomain::class,
    ChatDomain::class,
    MemoryDomain::class,
    RulesDomain::class,
    SequencesDomain::class,
    RemindersDomain::class,
    ProfilesDomain::class,
    ProcessesDomain::class,
    AccessDomain::class,
];
