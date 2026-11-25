<?php

declare(strict_types=1);

use App\Events\Inboxes\InboxJoined;
use App\Events\Inboxes\InboxLeft;
use App\Events\Inboxes\InboxMessageNumberTaken;
use App\Events\Inboxes\InboxOpened;
use App\Events\Messages\ClosingWordsDelivered;
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
use App\Events\Messages\UserPresenceConfirmed;
use App\Models\Agents\Agent;
use App\Support\ActorIdentity;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Communication with their role, owning transition or the files that send them.
 * Each row fact names its owning transition and a sample; every other event names the files that send it.
 * EventProducerTest fails on any producer not listed here.
 */
return [
    MessageRead::class => [
        'role' => EventRole::RowFact,
        'owner' => 'MessageReadEntry::create',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new MessageRead('message', 'inbox', ActorIdentity::ofClass(Agent::class, 'agent')),
    ],
    MessageSent::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Message::create',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new MessageSent('message', 'inbox', 1, null, ActorIdentity::ofClass(Agent::class, 'agent')),
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
            'app/Support/Notifications.php',
        ],
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
    InboxOpened::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Inbox::create',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new InboxOpened('inbox'),
    ],
    InboxJoined::class => [
        'role' => EventRole::RowFact,
        'owner' => 'InboxMember::create',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new InboxJoined('inbox', ActorIdentity::ofClass(Agent::class, 'agent')),
    ],
    InboxLeft::class => [
        'role' => EventRole::RowFact,
        'owner' => 'InboxMember::leave',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new InboxLeft('inbox', ActorIdentity::ofClass(Agent::class, 'agent')),
    ],
    ClosingWordsDelivered::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DriverTurn::markClosingWordsDelivered',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ClosingWordsDelivered('message', 'agent'),
    ],
];
