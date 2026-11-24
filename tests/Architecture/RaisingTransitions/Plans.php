<?php

declare(strict_types=1);

/**
 * The Plans transitions that raise facts, each called only inside a unit: a command handler, a transaction listener
 * or a model (ModelRaiseCallerTest).
 */
return [
    'Plan::cancel',
    'Plan::finish',
    'Plan::startOnce',
    'Phase::advanceRevision',
    'Phase::recordProgress',
    'PlanReviewEdition::withdraw',
    'PlanReviewEdition::approve',
    'PlanReviewEdition::requestChanges',
    'PlanReviewEdition::markHistorical',
];
