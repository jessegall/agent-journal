<?php

declare(strict_types=1);

/**
 * The Helpers transitions that raise facts, each called only inside a unit: a command handler, a transaction listener
 * or a model (ModelRaiseCallerTest).
 */
return [
    'HelperIdentity::designate',
    'HelperIdentity::releaseDesignation',
    'HelperJob::reopenForAttempt',
    'HelperJob::reopenForRepair',
    'HelperJob::attachTo',
    'HelperJob::addSteering',
    'HelperJob::finish',
    'HelperJob::cancel',
    'HelperJob::hold',
    'HelperJob::markUnfinished',
    'HelperNotice::markDelivered',
];
