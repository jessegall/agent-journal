<?php

declare(strict_types=1);

/**
 * The Connections transitions that raise facts, each called only inside a unit: a command handler, a required
 * listener or a model (ModelRaiseCallerTest).
 */
return [
    'BindingStart::create',
    'Environment::createForLabel',
    'Environment::createForDefault',
    'InstallAttempt::cancel',
    'InstallAttempt::create',
    'InstallAttempt::replace',
    'InstallAttempt::spendOn',
    'Project::create',
    'ProjectBinding::assignEnvironment',
    'ProjectBinding::create',
    'ProjectBinding::recordPresence',
    'ProjectBinding::revoke',
    'ProjectInvitation::create',
    'ProjectInvitation::revoke',
    'ProjectInvitation::spendOn',
    'DeviceGrant::restartWith',
    'DeviceGrant::approveBy',
    'DeviceGrant::recordPoll',
    'DeviceGrant::issue',
    'DeviceGrant::revoke',
    'Host::recordProtection',
    'Host::recordDescriptors',
    'Host::advertiseBrowserInput',
    'Host::revokeAt',
    'ProjectCommandRun::recordProcess',
    'ProjectCommandRun::finish',
    'ProjectCommandRun::requestCancellation',
    'ProjectCommandRun::cancel',
    'ProjectCommandRun::reconcile',
    'ProjectRead::markClaimed',
    'ProjectRead::answerWithEntries',
    'ProjectRead::answerWithText',
    'ProjectRead::fail',
    'WorkspaceRead::answer',
];
