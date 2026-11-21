<?php

declare(strict_types=1);

/**
 * The Connections transitions that raise facts, each called only inside a unit: a command handler, a required
 * listener or a model (ModelRaiseCallerTest).
 */
return [
    'InstallAttempt::cancel',
    'InstallAttempt::openFor',
    'InstallAttempt::replace',
    'InstallAttempt::spendOn',
    'Project::create',
    'ProjectBinding::create',
    'ProjectBinding::recordPresence',
    'ProjectBinding::revoke',
    'ProjectInvitation::issueFor',
    'ProjectInvitation::revoke',
    'ProjectInvitation::spendOn',
];
