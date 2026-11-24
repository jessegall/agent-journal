<?php

declare(strict_types=1);

use App\Enums\BindingReadiness;
use App\Enums\CommandRunState;
use App\Enums\ProjectReadFailure;
use App\Events\Connections\BindingStartRecorded;
use App\Events\Connections\DeviceGrantApproved;
use App\Events\Connections\DeviceGrantIssued;
use App\Events\Connections\DeviceGrantPolled;
use App\Events\Connections\DeviceGrantRestarted;
use App\Events\Connections\DeviceGrantRevoked;
use App\Events\Connections\EnvironmentOpened;
use App\Events\Connections\HostBrowserInputAdvertised;
use App\Events\Connections\HostCallAnswered;
use App\Events\Connections\HostCallFailed;
use App\Events\Connections\HostDescriptorsRecorded;
use App\Events\Connections\HostProtectionRecorded;
use App\Events\Connections\HostRevoked;
use App\Events\Connections\InstallAttemptCancelled;
use App\Events\Connections\InstallAttemptOpened;
use App\Events\Connections\InstallAttemptReplaced;
use App\Events\Connections\InstallAttemptSpent;
use App\Events\Connections\ProjectBindingCreated;
use App\Events\Connections\ProjectBindingEnvironmentAssigned;
use App\Events\Connections\ProjectBindingLeased;
use App\Events\Connections\ProjectBindingLeaseEnded;
use App\Events\Connections\ProjectBindingReadinessChanged;
use App\Events\Connections\ProjectBindingRevoked;
use App\Events\Connections\ProjectCommandCancellationRequested;
use App\Events\Connections\ProjectCommandCancelled;
use App\Events\Connections\ProjectCommandFinished;
use App\Events\Connections\ProjectCommandProcessRecorded;
use App\Events\Connections\ProjectCommandReconciled;
use App\Events\Connections\ProjectCreated;
use App\Events\Connections\ProjectInvitationIssued;
use App\Events\Connections\ProjectInvitationRevoked;
use App\Events\Connections\ProjectInvitationSpent;
use App\Events\Connections\ProjectReadAnsweredWithEntries;
use App\Events\Connections\ProjectReadAnsweredWithText;
use App\Events\Connections\ProjectReadClaimed;
use App\Events\Connections\ProjectReadFailed;
use App\Events\Connections\WorkspaceReadAnswered;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Connections with their role, owning transition or the files that send them.
 * Each row fact names its owning transition and a sample; every other event names the files that send it.
 * EventProducerTest fails on any producer not listed here.
 */
return [
    BindingStartRecorded::class => [
        'role' => EventRole::RowFact,
        'owner' => 'BindingStart::create',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new BindingStartRecorded('binding', 'start', 'runtime', new DateTimeImmutable('2026-01-01')),
    ],
    ProjectBindingEnvironmentAssigned::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ProjectBinding::assignEnvironment',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProjectBindingEnvironmentAssigned('binding', 'environment', new DateTimeImmutable('2026-01-01')),
    ],
    EnvironmentOpened::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Environment::create',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new EnvironmentOpened('environment', 'project', new DateTimeImmutable('2026-01-01')),
    ],
    InstallAttemptOpened::class => [
        'role' => EventRole::RowFact,
        'owner' => 'InstallAttempt::openFor',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new InstallAttemptOpened('attempt', 'IA-ABCDEFGH', new DateTimeImmutable('2026-01-01')),
    ],
    InstallAttemptReplaced::class => [
        'role' => EventRole::RowFact,
        'owner' => 'InstallAttempt::replace',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new InstallAttemptReplaced('attempt', 2, new DateTimeImmutable('2026-01-01')),
    ],
    InstallAttemptCancelled::class => [
        'role' => EventRole::RowFact,
        'owner' => 'InstallAttempt::cancel',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new InstallAttemptCancelled('attempt', new DateTimeImmutable('2026-01-01')),
    ],
    InstallAttemptSpent::class => [
        'role' => EventRole::RowFact,
        'owner' => 'InstallAttempt::spendOn',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new InstallAttemptSpent('attempt', 'binding', new DateTimeImmutable('2026-01-01')),
    ],
    ProjectBindingReadinessChanged::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ProjectBinding::recordPresence',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProjectBindingReadinessChanged('binding', BindingReadiness::Ready, new DateTimeImmutable('2026-01-01')),
    ],
    ProjectCreated::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Project::create',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProjectCreated('project', new DateTimeImmutable('2026-01-01')),
    ],
    ProjectInvitationIssued::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ProjectInvitation::create',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProjectInvitationIssued('invitation', new DateTimeImmutable('2026-01-01'), new DateTimeImmutable('2026-01-01')),
    ],
    ProjectInvitationRevoked::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ProjectInvitation::revoke',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProjectInvitationRevoked('invitation', new DateTimeImmutable('2026-01-01')),
    ],
    ProjectInvitationSpent::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ProjectInvitation::spendOn',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProjectInvitationSpent('invitation', 'binding', new DateTimeImmutable('2026-01-01')),
    ],
    ProjectBindingCreated::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ProjectBinding::create',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProjectBindingCreated('binding', 'project', 'host', new DateTimeImmutable('2026-01-01')),
    ],
    ProjectBindingRevoked::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ProjectBinding::revoke',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProjectBindingRevoked('binding', 2, new DateTimeImmutable('2026-01-01')),
    ],
    ProjectBindingLeased::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ProjectBinding::holdLease',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProjectBindingLeased('binding', 'runtime'),
    ],
    ProjectBindingLeaseEnded::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ProjectBinding::confirmStop',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProjectBindingLeaseEnded('binding', 'runtime'),
    ],
    DeviceGrantRestarted::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DeviceGrant::restartWith',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DeviceGrantRestarted('grant'),
    ],
    DeviceGrantApproved::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DeviceGrant::approveBy',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DeviceGrantApproved('grant', 'user'),
    ],
    DeviceGrantPolled::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DeviceGrant::recordPoll',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DeviceGrantPolled('grant'),
    ],
    DeviceGrantIssued::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DeviceGrant::issue',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DeviceGrantIssued('grant'),
    ],
    DeviceGrantRevoked::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DeviceGrant::revoke',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DeviceGrantRevoked('grant'),
    ],
    HostProtectionRecorded::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Host::recordProtection',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new HostProtectionRecorded('host'),
    ],
    HostDescriptorsRecorded::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Host::recordDescriptors',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new HostDescriptorsRecorded('host'),
    ],
    HostBrowserInputAdvertised::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Host::advertiseBrowserInput',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new HostBrowserInputAdvertised('host'),
    ],
    HostCallFailed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Host::recordCallFailure',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new HostCallFailed('host'),
    ],
    HostCallAnswered::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Host::recordCallAnswered',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new HostCallAnswered('host'),
    ],
    HostRevoked::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Host::revokeAt',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new HostRevoked('host'),
    ],
    ProjectCommandProcessRecorded::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ProjectCommandRun::recordProcess',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProjectCommandProcessRecorded('run', 1),
    ],
    ProjectCommandFinished::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ProjectCommandRun::finish',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProjectCommandFinished('run', 0),
    ],
    ProjectCommandCancellationRequested::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ProjectCommandRun::requestCancellation',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProjectCommandCancellationRequested('run'),
    ],
    ProjectCommandCancelled::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ProjectCommandRun::cancel',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProjectCommandCancelled('run'),
    ],
    ProjectCommandReconciled::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ProjectCommandRun::reconcile',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProjectCommandReconciled('run', CommandRunState::Cancelled),
    ],
    ProjectReadClaimed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ProjectRead::markClaimed',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProjectReadClaimed('read'),
    ],
    ProjectReadAnsweredWithEntries::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ProjectRead::answerWithEntries',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProjectReadAnsweredWithEntries('read'),
    ],
    ProjectReadAnsweredWithText::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ProjectRead::answerWithText',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProjectReadAnsweredWithText('read'),
    ],
    ProjectReadFailed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ProjectRead::fail',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProjectReadFailed('read', ProjectReadFailure::cases()[0]),
    ],
    WorkspaceReadAnswered::class => [
        'role' => EventRole::RowFact,
        'owner' => 'WorkspaceRead::answer',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new WorkspaceReadAnswered('read'),
    ],
];
