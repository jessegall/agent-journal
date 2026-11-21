<?php

declare(strict_types=1);

use App\Communication\Events\MessageAnswered;
use App\Communication\Events\MessageAnswerRequired;
use App\Communication\Events\MessageClaimReleased;
use App\Communication\Events\MessageDismissed;
use App\Communication\Events\MessageRead;
use App\Communication\Events\MessageSent;
use App\Communication\Events\MessageTakenUp;
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
        'migrated' => false,
        'producers' => [
            'app/Communication/Handlers/RequireMessageAnswerHandler.php',
        ],
    ],
    MessageAnswered::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Message::answerWith',
        'migrated' => false,
        'producers' => [
            'app/Communication/Support/MessageAnswers.php',
        ],
    ],
    MessageClaimReleased::class => [
        'role' => EventRole::RowFact,
        'owner' => 'AssignmentRecord::releaseClaimsFor',
        'migrated' => false,
        'producers' => [
            'app/Communication/Handlers/ReleaseMessageClaimHandler.php',
        ],
    ],
    MessageDismissed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Message::dismissBy',
        'migrated' => false,
        'producers' => [
            'app/Communication/Handlers/DismissMessageHandler.php',
        ],
    ],
    MessageRead::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Message::acknowledge',
        'migrated' => false,
        'producers' => [
            'app/Communication/Support/MessageReading.php',
        ],
    ],
    MessageSent::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Message::create',
        'migrated' => false,
        'producers' => [
            'app/Communication/Support/MessageSending.php',
        ],
    ],
    MessageTakenUp::class => [
        'role' => EventRole::RowFact,
        'owner' => 'AssignmentRecord::insertUnlessHeld',
        'migrated' => false,
        'producers' => [
            'app/Communication/Support/MessageReading.php',
        ],
    ],
];
