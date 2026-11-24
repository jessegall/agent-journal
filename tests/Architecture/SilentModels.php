<?php

declare(strict_types=1);

/**
 * The models whose mutations still raise no event of their own (MutationEventsTest). Each is a model that raises
 * nothing yet, so its writes must first all run inside a unit; a filed task converts each area, and a model
 * is taken off this list in the same change that gives its mutations their events.
 */
return [
    'AgentChatPermission',
    'AgentSession',
    'AgentStackRow',
    'CommandReceipt',
    'DriverRequest',
    'DriverTurn',
    'HookCall',
    'Layout',
    'NumberGroup',
    'PartRun',
    'ProfileRun',
    'SharePreview',
    'SkillContextEpoch',
    'StartRecord',
    'StopAttempt',
    'User',
    'WorkspaceRead',
];
