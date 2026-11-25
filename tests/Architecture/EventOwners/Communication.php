<?php

declare(strict_types=1);

use App\Enums\Assignments\ActorType;
use App\Enums\IntervalRole;
use App\Enums\LeaveReason;
use App\Enums\MessageBatchState;
use App\Enums\Messages\DismissalType;
use App\Enums\Messages\WakeState;
use App\Enums\SpeechOpportunityState;
use App\Events\Inboxes\InboxMessageNumberTaken;
use App\Events\Messages\AgentChatPermissionWithdrawn;
use App\Events\Messages\ChatLinePosted;
use App\Events\Messages\ChatMemberJoined;
use App\Events\Messages\ChatMemberLeft;
use App\Events\Messages\ChatMessageAccepted;
use App\Events\Messages\ChatMessageOffered;
use App\Events\Messages\ChatReceiptPresented;
use App\Events\Messages\ChatRoleChanged;
use App\Events\Messages\MessageAnswered;
use App\Events\Messages\MessageAnswerRequired;
use App\Events\Messages\MessageBatchClaimsGranted;
use App\Events\Messages\MessageBatchProgressed;
use App\Events\Messages\MessageBatchSettled;
use App\Events\Messages\MessageBatchTurnBound;
use App\Events\Messages\MessageClaimed;
use App\Events\Messages\MessageClaimReleased;
use App\Events\Messages\MessageDismissed;
use App\Events\Messages\MessageRangeConfirmed;
use App\Events\Messages\MessageRead;
use App\Events\Messages\MessageSent;
use App\Events\Messages\NotificationReceiptHidden;
use App\Events\Messages\NotificationReceiptRead;
use App\Events\Messages\NotificationReceiptRevealed;
use App\Events\Messages\NotificationsChanged;
use App\Events\Messages\NotificationsMarkAllAdvanced;
use App\Events\Messages\NotificationsMarkAllFinished;
use App\Events\Messages\NotificationsMarkAllStarted;
use App\Events\Messages\NotificationsWithdrawn;
use App\Events\Messages\OutstandingMessageRangeConfirmed;
use App\Events\Messages\OutstandingMessageRangeExhausted;
use App\Events\Messages\OutstandingMessageRangeFailed;
use App\Events\Messages\OutstandingMessageRangeReopened;
use App\Events\Messages\ReceiptDeliveriesScheduled;
use App\Events\Messages\ReceiptDeliveryChanged;
use App\Events\Messages\ReceiptDeliveryWakeTaken;
use App\Events\Messages\ReceiptProgressAdvanced;
use App\Events\Messages\SpeechOpportunityClaimed;
use App\Events\Messages\SpeechOpportunityReleased;
use App\Events\Messages\SpeechOpportunityReserved;
use App\Events\Messages\SpeechOpportunitySettled;
use App\Events\Messages\UserPresenceConfirmed;
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
            'app/Commands/Messages/ReleaseMessageClaim/ReleaseMessageClaimHandler.php',
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
            'app/Commands/Notifications/HideUnseatedNotifications/HideUnseatedNotificationsHandler.php',
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
    ReceiptDeliveryWakeTaken::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ReceiptDelivery::awaitShown',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ReceiptDeliveryWakeTaken('delivery', 'receipt'),
    ],
    NotificationsMarkAllStarted::class => [
        'role' => EventRole::RowFact,
        'owner' => 'NotificationScope::beginMarkAll',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new NotificationsMarkAllStarted('scope', 10),
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
    MessageBatchTurnBound::class => [
        'role' => EventRole::RowFact,
        'owner' => 'MessageBatch::bindTurn',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new MessageBatchTurnBound('batch', 'turn'),
    ],
    MessageBatchProgressed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'MessageBatch::recordProgress',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new MessageBatchProgressed('batch'),
    ],
    MessageBatchSettled::class => [
        'role' => EventRole::RowFact,
        'owner' => 'MessageBatch::settle',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new MessageBatchSettled('batch', MessageBatchState::cases()[0]),
    ],
    MessageBatchClaimsGranted::class => [
        'role' => EventRole::RowFact,
        'owner' => 'MessageBatch::grantClaims',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new MessageBatchClaimsGranted('batch'),
    ],
    MessageRangeConfirmed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'MessageRange::confirm',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new MessageRangeConfirmed('range'),
    ],
    OutstandingMessageRangeConfirmed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'OutstandingMessageRange::confirm',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new OutstandingMessageRangeConfirmed('range'),
    ],
    OutstandingMessageRangeFailed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'OutstandingMessageRange::recordFailure',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new OutstandingMessageRangeFailed('range'),
    ],
    OutstandingMessageRangeReopened::class => [
        'role' => EventRole::RowFact,
        'owner' => 'OutstandingMessageRange::reopen',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new OutstandingMessageRangeReopened('range'),
    ],
    OutstandingMessageRangeExhausted::class => [
        'role' => EventRole::RowFact,
        'owner' => 'OutstandingMessageRange::exhaust',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new OutstandingMessageRangeExhausted('range', 'reason'),
    ],
    ReceiptProgressAdvanced::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ReceiptProgress::advanceTo',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ReceiptProgressAdvanced('progress', 1),
    ],
    NotificationReceiptRead::class => [
        'role' => EventRole::RowFact,
        'owner' => 'NotificationReceipt::markRead',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new NotificationReceiptRead('receipt'),
    ],
    NotificationReceiptHidden::class => [
        'role' => EventRole::RowFact,
        'owner' => 'NotificationReceipt::hide',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new NotificationReceiptHidden('receipt'),
    ],
    NotificationReceiptRevealed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'NotificationReceipt::reveal',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new NotificationReceiptRevealed('receipt'),
    ],
    InboxMessageNumberTaken::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Inbox::takeMessageNumber',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new InboxMessageNumberTaken('inbox'),
    ],
    UserPresenceConfirmed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'UserPresence::beatAt',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new UserPresenceConfirmed('presence'),
    ],
    AgentChatPermissionWithdrawn::class => [
        'role' => EventRole::RowFact,
        'owner' => 'AgentChatPermission::withdraw',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AgentChatPermissionWithdrawn('permission'),
    ],
];
