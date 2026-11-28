<?php

declare(strict_types=1);

use App\Connections\Enums\BindingReadiness;
use App\Connections\Enums\CommandRunStatus;
use App\Events\Connections\BindingRuntimeRecorded;
use App\Events\Connections\DeviceGrantApproved;
use App\Events\Connections\DeviceGrantIssued;
use App\Events\Connections\DeviceGrantPolled;
use App\Events\Connections\DeviceGrantRestarted;
use App\Events\Connections\DeviceGrantRevoked;
use App\Events\Connections\DriverImageAdmitted;
use App\Events\Connections\DriverImageAllowed;
use App\Events\Connections\DriverImageAllowReset;
use App\Events\Connections\DriverImageAllowSetSent;
use App\Events\Connections\DriverImageBuildFinished;
use App\Events\Connections\DriverImageBuildSent;
use App\Events\Connections\DriverImageChecksSent;
use App\Events\Connections\DriverImageRefused;
use App\Events\Connections\DriverImageWaitServed;
use App\Events\Connections\EnvironmentOpened;
use App\Events\Connections\HostCallAnswered;
use App\Events\Connections\HostCallFailed;
use App\Events\Connections\HostHeartbeatRecorded;
use App\Events\Connections\HostInstructionAnswered;
use App\Events\Connections\HostInstructionClaimed;
use App\Events\Connections\HostInstructionMade;
use App\Events\Connections\HostInstructionOfferedAgain;
use App\Events\Connections\HostInstructionRefused;
use App\Events\Connections\HostProcessExited;
use App\Events\Connections\HostProcessInputGenerationRaised;
use App\Events\Connections\HostProcessInstructionNumbered;
use App\Events\Connections\HostProcessLost;
use App\Events\Connections\HostProcessOpened;
use App\Events\Connections\HostProcessOpenInstructionHeld;
use App\Events\Connections\HostProcessOutputRecorded;
use App\Events\Connections\HostProcessRestarted;
use App\Events\Connections\HostProcessSeenInHeartbeat;
use App\Events\Connections\HostProcessStarted;
use App\Events\Connections\HostProcessWorkerClaimed;
use App\Events\Connections\HostProcessWorkerRenewed;
use App\Events\Connections\HostReenrolled;
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
use App\Events\Connections\ProjectReadFailed;
use App\Events\Connections\WorkspaceReadAnswered;
use App\Hosts\Protocol\HostInstructionType;
use App\Hosts\Protocol\HostProjectReadFailure;
use App\Hosts\Protocol\HostRefusal;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Connections with their role, owning transition or the files that send them.
 * Each row fact names its owning transition and a sample; every other event names the files that send it.
 * EventProducerTest fails on any producer not listed here.
 */
return [
    DriverImageBuildSent::class => [
        'role' => EventRole::RowFact,
        'owner' => 'HostDriverImage::startAttempt',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DriverImageBuildSent('image', 'instruction'),
    ],
    DriverImageBuildFinished::class => [
        'role' => EventRole::RowFact,
        'owner' => 'HostDriverImage::built',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DriverImageBuildFinished('image', 'sha256:a'),
    ],
    DriverImageAllowSetSent::class => [
        'role' => EventRole::RowFact,
        'owner' => 'HostDriverImage::orderedIn',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DriverImageAllowSetSent('image', 'instruction'),
    ],
    DriverImageAllowed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'HostDriverImage::acknowledged',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DriverImageAllowed('image'),
    ],
    DriverImageChecksSent::class => [
        'role' => EventRole::RowFact,
        'owner' => 'HostDriverImage::markChecksSent',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DriverImageChecksSent('image', 'instruction'),
    ],
    DriverImageAllowReset::class => [
        'role' => EventRole::RowFact,
        'owner' => 'HostDriverImage::reallow',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DriverImageAllowReset('image'),
    ],
    DriverImageWaitServed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'HostDriverImageWait::consume',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DriverImageWaitServed('image', 'start'),
    ],
    DriverImageAdmitted::class => [
        'role' => EventRole::RowFact,
        'owner' => 'HostDriverImage::checked',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DriverImageAdmitted('image'),
    ],
    DriverImageRefused::class => [
        'role' => EventRole::RowFact,
        'owner' => 'HostDriverImage::refuse',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DriverImageRefused('image'),
    ],
    BindingRuntimeRecorded::class => [
        'role' => EventRole::RowFact,
        'owner' => 'BindingRuntime::create',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new BindingRuntimeRecorded('binding', 'start', 'runtime', new DateTimeImmutable('2026-01-01')),
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
        'owner' => 'InstallAttempt::create',
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
        'sample' => fn () => new ProjectCommandReconciled('run', CommandRunStatus::Cancelled),
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
        'sample' => fn () => new ProjectReadFailed('read', HostProjectReadFailure::cases()[0]),
    ],
    WorkspaceReadAnswered::class => [
        'role' => EventRole::RowFact,
        'owner' => 'WorkspaceRead::answer',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new WorkspaceReadAnswered('read'),
    ],
    HostProcessSeenInHeartbeat::class => [
        'role' => EventRole::RowFact,
        'owner' => 'HostProcess::seeInHeartbeat',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new HostProcessSeenInHeartbeat('process'),
    ],
    HostProcessWorkerClaimed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'HostProcess::claimWorker',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new HostProcessWorkerClaimed('process', 1),
    ],
    HostProcessWorkerRenewed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'HostProcess::renewWorker',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new HostProcessWorkerRenewed('process', 1),
    ],
    HostProcessInstructionNumbered::class => [
        'role' => EventRole::RowFact,
        'owner' => 'HostProcess::takeInstructionNumber',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new HostProcessInstructionNumbered('process', 1),
    ],
    HostProcessOpenInstructionHeld::class => [
        'role' => EventRole::RowFact,
        'owner' => 'HostProcess::holdOpenInstruction',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new HostProcessOpenInstructionHeld('process', 'instruction'),
    ],
    HostProcessInputGenerationRaised::class => [
        'role' => EventRole::RowFact,
        'owner' => 'HostProcess::raiseInputGeneration',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new HostProcessInputGenerationRaised('process', 1),
    ],
    HostInstructionClaimed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'HostInstruction::claim',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new HostInstructionClaimed('instruction', 'process'),
    ],
    HostInstructionOfferedAgain::class => [
        'role' => EventRole::RowFact,
        'owner' => 'HostInstruction::offerAgain',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new HostInstructionOfferedAgain('instruction', 'process'),
    ],
    HostReenrolled::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Host::reenroll',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new HostReenrolled('host'),
    ],
    HostHeartbeatRecorded::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Host::recordHeartbeat',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new HostHeartbeatRecorded('host'),
    ],
    HostInstructionMade::class => [
        'role' => EventRole::RowFact,
        'owner' => 'HostInstruction::create',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new HostInstructionMade('instruction', 'process', 'host'),
    ],
    HostInstructionAnswered::class => [
        'role' => EventRole::RowFact,
        'owner' => 'HostInstruction::answer',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new HostInstructionAnswered('instruction', 'process', HostInstructionType::cases()[0]),
    ],
    HostInstructionRefused::class => [
        'role' => EventRole::RowFact,
        'owner' => 'HostInstruction::refuse',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new HostInstructionRefused(
            'instruction',
            'process',
            HostInstructionType::cases()[0],
            HostRefusal::cases()[0],
            'the rows moved on',
        ),
    ],
    HostProcessOutputRecorded::class => [
        'role' => EventRole::RowFact,
        'owner' => 'HostProcess::recordOutputThrough',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new HostProcessOutputRecorded('process', 8),
    ],
    HostProcessOpened::class => [
        'role' => EventRole::RowFact,
        'owner' => 'HostProcess::create',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new HostProcessOpened('process', 'runtime', 'session'),
    ],
    HostProcessStarted::class => [
        'role' => EventRole::RowFact,
        'owner' => 'HostProcess::run',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new HostProcessStarted('process', 'runtime', 1, 'pid:1'),
    ],
    HostProcessRestarted::class => [
        'role' => EventRole::RowFact,
        'owner' => 'HostProcess::restart',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new HostProcessRestarted('process', 'runtime', 2, 'pid:2'),
    ],
    HostProcessExited::class => [
        'role' => EventRole::RowFact,
        'owner' => 'HostProcess::exit',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new HostProcessExited('process', 'runtime', 'session', 0, null, 'exited 0'),
    ],
    HostProcessLost::class => [
        'role' => EventRole::RowFact,
        'owner' => 'HostProcess::lose',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new HostProcessLost('process', 'runtime', 'session', 'lost'),
    ],
];
