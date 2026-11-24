<?php

declare(strict_types=1);

use App\Enums\ActorType;
use App\Enums\DismissalType;
use App\Enums\IntervalRole;
use App\Enums\LeaveReason;
use App\Enums\SpeechOpportunityState;
use App\Enums\WakeState;
use App\Events\ChatLinePosted;
use App\Events\ChatMemberJoined;
use App\Events\ChatMemberLeft;
use App\Events\ChatMessageAccepted;
use App\Events\ChatMessageOffered;
use App\Events\ChatReceiptPresented;
use App\Events\ChatRoleChanged;
use App\Events\MessageAnswered;
use App\Events\MessageAnswerRequired;
use App\Events\MessageClaimed;
use App\Events\MessageClaimReleased;
use App\Events\MessageDismissed;
use App\Events\MessageRead;
use App\Events\MessageSent;
use App\Events\NotificationsChanged;
use App\Events\NotificationsMarkAllAdvanced;
use App\Events\NotificationsMarkAllBegun;
use App\Events\NotificationsMarkAllFinished;
use App\Events\NotificationsWithdrawn;
use App\Events\ReceiptDeliveriesScheduled;
use App\Events\ReceiptDeliveryAwaitingShown;
use App\Events\ReceiptDeliveryChanged;
use App\Events\SpeechOpportunityClaimed;
use App\Events\SpeechOpportunityReleased;
use App\Events\SpeechOpportunityReserved;
use App\Events\SpeechOpportunitySettled;
use App\Support\ActorIdentity;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Communication with their role, owning transition or the files that send them.
 * Each row fact names its owning transition and a sample; every other event names the files that send it.
 * EventProducerTest fails on any producer not listed here.
 */
return [
    ChatLinePosted::class => [
        'role' => EventRole::RowFact,
        'owner' => 'TimelineEvent::create',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ChatLinePosted('event', 'inbox', 1),
    ],
    ChatMessageAccepted::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Message::createChat',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ChatMessageAccepted('message', new ActorIdentity(ActorType::User, 'user'), 'inbox'),
    ],
    ChatMessageOffered::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SpeechOpportunity::create',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ChatMessageOffered('inbox', 'message', new ActorIdentity(ActorType::Agent, 'agent')),
    ],
    ChatMemberJoined::class => [
        'role' => EventRole::RowFact,
        'owner' => 'InboxInterval::create',
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
    ChatRoleChanged::class => [
        'role' => EventRole::RowFact,
        'owner' => 'InboxInterval::takeRole',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ChatRoleChanged(
            'interval',
            'inbox',
            new ActorIdentity(ActorType::User, 'user'),
            IntervalRole::Owner,
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
            'app/Support/ReceiptDeliveryService.php',
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
            'ReceiptDelivery::recordChange',
        ],
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ReceiptDeliveryChanged('delivery', 'receipt', WakeState::Accepted),
    ],
    SpeechOpportunitySettled::class => [
        'role' => EventRole::RowFact,
        'owner' => [
            'SpeechOpportunity::spend',
            'SpeechOpportunity::decline',
            'SpeechOpportunity::cancel',
            'SpeechOpportunity::settle',
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
            'app/Commands/ReleaseMessageClaim/ReleaseMessageClaimHandler.php',
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
        'owner' => 'Message::createDesk',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new MessageSent('message', new ActorIdentity(ActorType::Agent, 'agent'), 'source', 'destination'),
    ],
    MessageClaimed::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Support/MessageService.php',
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
            'app/Commands/HideUnseatedNotifications/HideUnseatedNotificationsHandler.php',
            'app/Support/RecipientNotifications.php',
        ],
    ],
    SpeechOpportunityReserved::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SpeechOpportunity::reserveFor',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SpeechOpportunityReserved('opportunity', 'message'),
    ],
    SpeechOpportunityClaimed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SpeechOpportunity::claim',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SpeechOpportunityClaimed('opportunity'),
    ],
    SpeechOpportunityReleased::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SpeechOpportunity::release',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SpeechOpportunityReleased('opportunity'),
    ],
    ReceiptDeliveryAwaitingShown::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ReceiptDelivery::awaitShown',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ReceiptDeliveryAwaitingShown('delivery', 'receipt'),
    ],
    NotificationsMarkAllBegun::class => [
        'role' => EventRole::RowFact,
        'owner' => 'NotificationScope::beginMarkAll',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new NotificationsMarkAllBegun('scope', 10),
    ],
    NotificationsMarkAllAdvanced::class => [
        'role' => EventRole::RowFact,
        'owner' => 'NotificationScope::advanceMarkAll',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new NotificationsMarkAllAdvanced('scope', 5),
    ],
    NotificationsMarkAllFinished::class => [
        'role' => EventRole::RowFact,
        'owner' => 'NotificationScope::finishMarkAll',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new NotificationsMarkAllFinished('scope'),
    ],
];
