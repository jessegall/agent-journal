<?php

declare(strict_types=1);

/**
 * The Agents transitions that raise facts, each called only inside a unit: a command handler, a transaction listener
 * or a model (ModelRaiseCallerTest).
 */
return [
    'DriverSwitch::markStopped',
    'ProcessStart::refuse',
    'Agent::preferVariant',
    'Agent::adoptRuntime',
    'Agent::fenceRuntimes',
    'Agent::retireAt',
    'AgentRuntime::markStopping',
    'AgentRuntime::holdFor',
    'AgentRuntime::closeAfterExit',
    'AgentRuntime::begin',
    'AgentRuntime::confirmAlive',
    'AgentRuntime::recordObservation',
    'AgentRuntime::observeSettings',
    'AgentRuntime::holdStartGrant',
    'AgentRuntime::claimStartGrant',
    'AgentRuntime::recomputeRequestedSettings',
    'AgentRuntime::reassignTo',
    'AgentRuntime::requestModel',
    'StartToken::issueFor',
    'StartToken::rotateTo',
    'StartToken::revokeAt',
    'CleanupOperation::recordPass',
    'RevisionFence::markReconciledAt',
    'DriverApproval::approveBuilds',
    'MenuEntry::used',
    'MenuEntry::supersededBy',
    'MenuEntry::retire',
    'TerminalGrant::sendTakeWith',
    'TerminalGrant::issue',
    'TerminalGrant::refuse',
    'TerminalGrant::renew',
    'TerminalGrant::release',
    'TerminalGrant::markReleased',
    'TerminalGrant::retire',
    'TerminalGrant::takeSequence',
    'TerminalView::follow',
    'TerminalView::close',
    'MenuEntry::provenOn',
    'MenuEntry::markStaleOn',
];
