<?php

declare(strict_types=1);

use App\Communication\Events\MessageAnswered;
use App\Communication\Events\MessageAnswerRequired;
use App\Communication\Events\MessageClaimReleased;
use App\Communication\Events\MessageDismissed;
use App\Communication\Events\MessageRead;
use App\Communication\Events\MessageSent;
use App\Communication\Events\MessageTakenUp;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Communication\Enums\DismissalType;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Communication with their role, owning transition and the files that send them today (doc 70, table 1).
 * Each migration slice sets migrated, names a sample, and leaves its owner the one producer; EventProducerTest fails
 * on any producer not listed here.
 */
return [
    MessageAnswerRequired::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Message::requireAnswer',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new MessageAnswerRequired('message', 'inbox'),
    ],
    MessageAnswered::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Message::answerWith',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new MessageAnswered('message', 'reply', new ActorIdentity(ActorType::Agent, 'agent')),
    ],
    MessageClaimReleased::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Communication/Handlers/ReleaseMessageClaimHandler.php',
        ],
    ],
    MessageDismissed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Message::dismissBy',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new MessageDismissed('message', new ActorIdentity(ActorType::Agent, 'agent'), DismissalType::Declined),
    ],
    MessageRead::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Message::acknowledge',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new MessageRead('message', 'inbox', new ActorIdentity(ActorType::Agent, 'agent')),
    ],
    MessageSent::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Message::create',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new MessageSent('message', new ActorIdentity(ActorType::Agent, 'agent'), 'source', 'destination'),
    ],
    MessageTakenUp::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Communication/Support/MessageReading.php',
        ],
    ],
];
