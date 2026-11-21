<?php

declare(strict_types=1);

/**
 * The model methods of Profiles that still write outside their own row, each with the plan 40 phase that moves
 * the write (doc 70, table 2). The list only shrinks: ModelOwnRowTest fails on a write not listed here and on a
 * listed method that writes only its own row.
 */
return [
    'Profile::activate' => 5,
    'ProfileDraft::lockForProfiles' => 5,
    'ProfileDraft::saveFor' => 5,
    'SignInAttempt::claimFor' => 3,
    'SignInAttempt::writeFolderOf' => 3,
];
