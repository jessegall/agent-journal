<?php

declare(strict_types=1);

/**
 * The model methods of Agents that still write outside their own row, each with the plan 40 phase that moves
 * the write (doc 70, table 2). The list only shrinks: ModelOwnRowTest fails on a write not listed here and on a
 * listed method that writes only its own row.
 */
return [
    'AgentRuntime::closeAfterExit' => 8,
    'AgentSession::captureJobSourceMessage' => 8,
    'AgentSession::markSilentIfNoHeartbeatSince' => 8,
    'AgentSession::recordDiscoveryAt' => 8,
    'AgentSession::selectMessage' => 8,
    'CapacityReservation::releaseFor' => 8,
    'CertifiedWork::record' => 8,
    'CleanupOperation::open' => 8,
    'DriverRequest::cancel' => 8,
    'DriverRequest::settleAfterExit' => 8,
    'MergeAttempt::retain' => 8,
    'NavigationRequest::cancelOpenFor' => 8,
    'NavigationRequest::cancelQueuedRounds' => 8,
    'ProcessStart::cancelPendingOf' => 8,
    'ProcessStart::cancelPendingOfAgent' => 8,
    'ProcessStart::claimFor' => 8,
    'ProcessStart::stopProven' => 8,
    'RevisionFence::retain' => 8,
    'SessionOutputGrant::replaceFor' => 8,
    'StartBypass::recordAll' => 8,
    'StartRecord::confirmConversation' => 8,
    'TerminalView::endLapsed' => 8,
    'TerminalView::endOfStoppedRuntimes' => 8,
    'TerminalView::pruneEndedBefore' => 8,
    'WorkReservation::retain' => 8,
    'WorkspaceRead::retain' => 8,
];
