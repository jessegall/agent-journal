<?php

declare(strict_types=1);

/**
 * The Profiles transitions that raise facts, each called only inside a unit: a command handler, a transaction listener
 * or a model (ModelRaiseCallerTest).
 */
return [
    'Account::applyCheck',
    'Account::applyCleanup',
    'Account::beginRemoval',
    'Account::holdForMaintenance',
    'Account::rename',
    'Account::retryCleanup',
    'Account::signedInAgain',
    'AccountNotice::countAgain',
    'AccountNotice::create',
    'AccountNotice::resolveAt',
    'AccountUsageCost::add',
    'AccountUsageTokens::create',
    'AccountUsageTokens::replaceWith',
    'AccountUsageWindow::create',
    'AccountUsageWindow::replaceWith',
    'ActiveAccount::switchTo',
    'SignInAttempt::create',
    'SignInAttempt::finish',
    'SignInAttempt::releaseForHost',
    'SignInAttempt::retryCleanup',
];
