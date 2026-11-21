<?php

declare(strict_types=1);

/**
 * The Connections transitions that raise facts, each called only inside a unit: a command handler, a required
 * listener or a model (ModelRaiseCallerTest).
 */
return [
    'Project::create',
    'ProjectBinding::create',
    'ProjectBinding::recordPresence',
    'ProjectBinding::revoke',
    'ProjectInvitation::issue',
    'ProjectInvitation::issueForNewProject',
    'ProjectInvitation::issueToJoin',
    'ProjectInvitation::revoke',
    'ProjectInvitation::spendOn',
];
