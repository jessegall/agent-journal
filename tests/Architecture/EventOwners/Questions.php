<?php

declare(strict_types=1);

use App\Models\Agents\Agent;
use App\Support\ActorIdentity;
use Domain\Questions\Events\QuestionAnswered;
use Domain\Questions\Events\QuestionAnswerNoticeDelivered;
use Domain\Questions\Events\QuestionAnswerNoticeWritten;
use Domain\Questions\Events\QuestionAsked;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Questions with their role, owning transition or the files that send them.
 * Each row fact names its owning transition and a sample; every other event names the files that send it.
 * EventProducerTest fails on any producer not listed here.
 */
return [
    QuestionAsked::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Question::create',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new QuestionAsked('question', 'inbox', ActorIdentity::ofClass(Agent::class, 'asker'), ActorIdentity::ofClass(Agent::class, 'target')),
    ],
    QuestionAnswered::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Question::answer',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new QuestionAnswered('question', 'inbox', ActorIdentity::ofClass(Agent::class, 'agent')),
    ],
    QuestionAnswerNoticeWritten::class => [
        'role' => EventRole::RowFact,
        'owner' => 'QuestionAnswerNotice::create',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new QuestionAnswerNoticeWritten('notice', 'question', ActorIdentity::ofClass(Agent::class, 'agent')),
    ],
    QuestionAnswerNoticeDelivered::class => [
        'role' => EventRole::RowFact,
        'owner' => 'QuestionAnswerNotice::markDelivered',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new QuestionAnswerNoticeDelivered('notice', 'question'),
    ],
];
