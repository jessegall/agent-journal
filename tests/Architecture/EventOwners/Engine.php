<?php

declare(strict_types=1);

use App\Enums\RefusalCode;
use App\Events\Engine\AgentStackClosed;
use App\Events\Engine\AgentStackFramesSaved;
use App\Events\Engine\AgentStackHeldForInvestigation;
use App\Events\Engine\AgentStackStarted;
use App\Events\Engine\CommandReceiptCompleted;
use App\Events\Engine\CommandReceiptRefused;
use App\Events\Engine\EngineTicked;
use App\Events\Engine\NumberGroupRetired;
use App\Events\Engine\NumberTaken;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Engine with their role, owning transition or the files that send them.
 * Each row fact names its owning transition and a sample; every other event names the files that send it.
 * EventProducerTest fails on any producer not listed here.
 */
return [
    EngineTicked::class => [
        'role' => EventRole::Infrastructure,
        'migrated' => false,
        'producers' => [
            'app/Support/EngineTickedDelivery.php',
        ],
    ],
    AgentStackStarted::class => [
        'role' => EventRole::RowFact,
        'owner' => 'AgentStackRow::startFor',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AgentStackStarted('stack'),
    ],
    AgentStackHeldForInvestigation::class => [
        'role' => EventRole::RowFact,
        'owner' => 'AgentStackRow::holdForInvestigation',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AgentStackHeldForInvestigation('stack'),
    ],
    AgentStackFramesSaved::class => [
        'role' => EventRole::RowFact,
        'owner' => 'AgentStackRow::saveFrames',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AgentStackFramesSaved('stack'),
    ],
    AgentStackClosed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'AgentStackRow::closeAt',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AgentStackClosed('stack'),
    ],
    NumberTaken::class => [
        'role' => EventRole::RowFact,
        'owner' => 'NumberGroup::takeNumber',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new NumberTaken('group', 1),
    ],
    NumberGroupRetired::class => [
        'role' => EventRole::RowFact,
        'owner' => 'NumberGroup::retire',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new NumberGroupRetired('group'),
    ],
    CommandReceiptCompleted::class => [
        'role' => EventRole::RowFact,
        'owner' => 'CommandReceipt::complete',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new CommandReceiptCompleted('receipt'),
    ],
    CommandReceiptRefused::class => [
        'role' => EventRole::RowFact,
        'owner' => 'CommandReceipt::refuse',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new CommandReceiptRefused('receipt', RefusalCode::cases()[0]),
    ],
];
