<?php

declare(strict_types=1);
use Domain\Access\AccessDomain;
use Domain\Chat\ChatDomain;
use Domain\Documents\DocumentsDomain;
use Domain\Memory\MemoryDomain;
use Domain\Plans\PlansDomain;
use Domain\Reminders\RemindersDomain;
use Domain\Rules\RulesDomain;
use Domain\Sequences\SequencesDomain;
use Domain\Tasks\TasksDomain;

return [
    TasksDomain::class,
    PlansDomain::class,
    DocumentsDomain::class,
    ChatDomain::class,
    MemoryDomain::class,
    RulesDomain::class,
    SequencesDomain::class,
    RemindersDomain::class,
    AccessDomain::class,
];
