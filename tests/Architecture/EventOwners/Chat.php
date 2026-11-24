<?php

declare(strict_types=1);

use App\Enums\ActorType;
use App\Support\ActorIdentity;
use Domain\Chat\Events\ChatReconciled;
use Domain\Chat\Events\ChatReconcileMarked;
use Domain\Chat\Events\ConversationClosed;
use Domain\Chat\Events\ConversationTransferred;
use Domain\Chat\Events\DirectChatRemoved;
use Domain\Chat\Events\DockChanged;
use App\Events\Messages\MessageReactionAdded;
use App\Events\Messages\MessageReactionWithdrawn;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Chat with their role, owning transition or the files that send them.
 * Each row fact names its owning transition and a sample; every other event names the files that send it.
 * EventProducerTest fails on any producer not listed here.
 */
return [
    ChatReconcileMarked::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Conversation::markReconcilePending',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ChatReconcileMarked('conversation'),
    ],
    ChatReconciled::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Conversation::clearReconcilePending',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ChatReconciled('conversation'),
    ],
    DockChanged::class => [
        'role' => EventRole::RowFact,
        'owner' => ['DockPlacement::create', 'DockPlacement::remove'],
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DockChanged('conversation'),
    ],
    MessageReactionAdded::class => [
        'role' => EventRole::RowFact,
        'owner' => 'MessageReaction::create',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new MessageReactionAdded('inbox', 'message', new ActorIdentity(ActorType::User, 'user')),
    ],
    ConversationClosed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Conversation::close',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ConversationClosed('conversation'),
    ],
    ConversationTransferred::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Conversation::transferTo',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ConversationTransferred('conversation', new ActorIdentity(ActorType::User, 'user')),
    ],
    MessageReactionWithdrawn::class => [
        'role' => EventRole::RowFact,
        'owner' => 'MessageReaction::withdraw',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new MessageReactionWithdrawn('inbox', 'message', new ActorIdentity(ActorType::User, 'user')),
    ],
    DirectChatRemoved::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DirectChat::remove',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DirectChatRemoved('chat'),
    ],
];
