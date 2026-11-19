<?php

declare(strict_types=1);

namespace App\Hooks\Support;

use App\Hooks\Exceptions\AccountConfigurationUnwritten;
use App\Hooks\Programs\CodexFolderTrust;

/**
 * Adds a folder's trust to a Codex account's config.toml on the host, one writer at a time under a short lock on the
 * account: it reads the latest file, keeps every entry already in it, such as the hooks and the file sign-in store,
 * adds only the new table and replaces the file in one rename, so a reader sees the whole old or new file and running
 * threads are left alone.
 */
final readonly class AccountConfigurationWrite
{
    /**
     * Adds the trust when the file lacks it, and answers whether it changed the file.
     *
     * @throws AccountConfigurationUnwritten
     */
    public function addTrust(string $accountDirectory, CodexFolderTrust $trust): bool
    {
        $path = rtrim($accountDirectory, '/').'/config.toml';
        $lock = fopen($path.'.lock', 'c');

        if ($lock === false || ! flock($lock, LOCK_EX)) {
            throw AccountConfigurationUnwritten::at($path);
        }

        try {
            $current = is_file($path) ? (string) file_get_contents($path) : '';

            if ($trust->isIn($current)) {
                return false;
            }

            $this->replace($path, $this->withTrust($current, $trust));

            return true;
        } finally {
            flock($lock, LOCK_UN);
            fclose($lock);
        }
    }

    private function withTrust(string $current, CodexFolderTrust $trust): string
    {
        $separator = match (true) {
            $current === '' => '',
            str_ends_with($current, "\n") => "\n",
            default => "\n\n",
        };

        return $current.$separator.$trust->tomlTable();
    }

    /**
     * @throws AccountConfigurationUnwritten
     */
    private function replace(string $path, string $contents): void
    {
        $temporary = $path.'.'.bin2hex(random_bytes(6)).'.new';
        $isWritten = file_put_contents($temporary, $contents) === strlen($contents)
            && chmod($temporary, 0600)
            && rename($temporary, $path);

        if (! $isWritten) {
            if (is_file($temporary)) {
                unlink($temporary);
            }

            throw AccountConfigurationUnwritten::at($path);
        }
    }
}
