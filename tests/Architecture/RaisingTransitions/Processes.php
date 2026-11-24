<?php

declare(strict_types=1);

/**
 * The Processes transitions that raise facts, each called only inside a unit: a command handler, a transaction listener
 * or a model (ModelRaiseCallerTest).
 */
return [
    'ReaderPosition::markFailed',
    'ReaderPosition::rewindTo',
    'ReaderPosition::advance',
    'ResultReceipt::supersedeBy',
    'ClassificationRule::retire',
    'EvidencePermit::consume',
    'EvidencePermit::expire',
    'RuleProposal::withdraw',
    'RuleProposal::adopt',
];
