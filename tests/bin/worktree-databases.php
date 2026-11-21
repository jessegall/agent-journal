<?php

declare(strict_types=1);

/**
 * The test database a worktree's runs use, named after its folder: journal_hooks_test_wt_<folder>.
 */
function worktreeDatabaseOf(string $folder): string
{
    return 'journal_hooks_test_wt_'.substr((string) preg_replace('/[^a-z0-9]/', '', strtolower($folder)), 0, 30);
}
