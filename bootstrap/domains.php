<?php

declare(strict_types=1);
use Domain\Chat\ChatDomain;
use Domain\Comments\CommentsDomain;
use Domain\Documents\DocumentsDomain;
use Domain\Helpers\HelpersDomain;
use Domain\Memory\MemoryDomain;
use Domain\Plans\PlansDomain;
use Domain\Questions\QuestionsDomain;
use Domain\Reminders\RemindersDomain;
use Domain\Rules\RulesDomain;
use Domain\Sequences\SequencesDomain;
use Domain\Sharing\SharingDomain;
use Domain\Tasks\TasksDomain;

return [
    CommentsDomain::class,
    TasksDomain::class,
    PlansDomain::class,
    DocumentsDomain::class,
    ChatDomain::class,
    MemoryDomain::class,
    RulesDomain::class,
    SequencesDomain::class,
    SharingDomain::class,
    QuestionsDomain::class,
    RemindersDomain::class,
    HelpersDomain::class,
];
