<?php

declare(strict_types=1);

/**
 * The Connections transitions that raise facts, each called only inside a unit: a command handler, a required
 * listener or a model (ModelRaiseCallerTest).
 */
return [
    'Environment::create',
    'Environment::openDefaultOf',
    'InstallAttempt::cancel',
    'InstallAttempt::openFor',
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
];
