<?php

declare(strict_types=1);

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Communication\Enums\DismissalType;
use App\Communication\Enums\LeaveReason;
use App\Communication\Enums\ReceiptDeliveryState;
use App\Communication\Enums\SpeechOpportunityState;
use App\Communication\Events\ChatMemberJoined;
use App\Communication\Events\ChatMemberLeft;
use App\Communication\Events\ChatMessageAccepted;
use App\Communication\Events\ChatReceiptPresented;
use App\Communication\Events\MessageAnswered;
use App\Communication\Events\MessageAnswerRequired;
use App\Communication\Events\MessageClaimReleased;
use App\Communication\Events\MessageDismissed;
use App\Communication\Events\MessageRead;
use App\Communication\Events\MessageSent;
use App\Communication\Events\MessageTakenUp;
use App\Communication\Events\NotificationsChanged;
use App\Communication\Events\NotificationsWithdrawn;
use App\Communication\Events\ReceiptDeliveriesScheduled;
use App\Communication\Events\ReceiptDeliveryChanged;
use App\Communication\Events\SpeechOpportunitySettled;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Communication with their role, owning transition or the files that send them.
 * Each row fact names its owning transition and a sample; every other event names the files that send it.
 * EventProducerTest fails on any producer not listed here.
 */
return [
    ChatMessageAccepted::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Message::createChat',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ChatMessageAccepted('message', new ActorIdentity(ActorType::User, 'user'), 'inbox'),
    ],
    ChatMemberJoined::class => [
        'role' => EventRole::RowFact,
        'owner' => 'InboxInterval::open',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ChatMemberJoined('interval', 'inbox', new ActorIdentity(ActorType::Agent, 'agent')),
    ],
    ChatMemberLeft::class => [
        'role' => EventRole::RowFact,
        'owner' => 'InboxInterval::end',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ChatMemberLeft(
            'interval',
            'inbox',
            new ActorIdentity(ActorType::Agent, 'agent'),
            LeaveReason::Left,
        ),
    ],
    ChatReceiptPresented::class => [
        'role' => EventRole::RowFact,
        'owner' => 'MessageReceipt::present',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ChatReceiptPresented('receipt', 'message', 'interval'),
    ],
    ReceiptDeliveriesScheduled::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Communication/Support/ReceiptDeliveries.php',
        ],
    ],
    ReceiptDeliveryChanged::class => [
        'role' => EventRole::RowFact,
        'owner' => [
            'ReceiptDelivery::accept',
            'ReceiptDelivery::await',
            'ReceiptDelivery::fail',
            'ReceiptDelivery::exhaust',
            'ReceiptDelivery::cancel',
        ],
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ReceiptDeliveryChanged('delivery', 'receipt', ReceiptDeliveryState::Accepted),
    ],
    SpeechOpportunitySettled::class => [
        'role' => EventRole::RowFact,
        'owner' => [
            'SpeechOpportunity::spend',
            'SpeechOpportunity::decline',
            'SpeechOpportunity::cancel',
        ],
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SpeechOpportunitySettled(
            'opportunity',
            'root',
            new ActorIdentity(ActorType::Agent, 'agent'),
            SpeechOpportunityState::Spent,
        ),
    ],
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
    NotificationsChanged::class => [
        'role' => EventRole::RowFact,
        'owner' => [
            'NotificationScope::addReceipt',
            'NotificationScope::addUnread',
            'NotificationScope::removeUnread',
            'NotificationScope::recordChange',
        ],
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new NotificationsChanged('scope'),
    ],
    NotificationsWithdrawn::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Communication/Handlers/HideUnseatedNotificationsHandler.php',
            'app/Communication/Support/RecipientNotifications.php',
        ],
    ],
];
