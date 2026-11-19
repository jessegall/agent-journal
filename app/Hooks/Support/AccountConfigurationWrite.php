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
        return $this->prepare($accountDirectory, [], [], $trust);
    }

    /**
     * Adds, in one locked write, each top-level setting and each table the file lacks and the root's trust, and
     * answers whether it changed the file. A setting or table already there is left exactly as it is.
     *
     * @param  array<string, string>  $settings  top-level keys and their TOML values, such as the file sign-in store
     * @param  list<string>  $tables  whole TOML tables, each known by its header line
     *
     * @throws AccountConfigurationUnwritten
     */
    public function prepare(string $accountDirectory, array $settings, array $tables, CodexFolderTrust $trust): bool
    {
        $path = rtrim($accountDirectory, '/').'/config.toml';
        $lock = fopen($path.'.lock', 'c');

        if ($lock === false || ! flock($lock, LOCK_EX)) {
            throw AccountConfigurationUnwritten::at($path);
        }

        try {
            $current = is_file($path) ? (string) file_get_contents($path) : '';
            $prepared = $this->withTables($this->withSettings($current, $settings), [...$tables, $trust->tomlTable()]);

            if ($prepared === $current) {
                return false;
            }

            $this->replace($path, $prepared);

            return true;
        } finally {
            flock($lock, LOCK_UN);
            fclose($lock);
        }
    }

    /**
     * The configuration with each missing top-level setting put first, where no table can claim it.
     *
     * @param  array<string, string>  $settings
     */
    private function withSettings(string $current, array $settings): string
    {
        $firstTable = preg_match('/^\[/m', $current, $match, PREG_OFFSET_CAPTURE) === 1 ? $match[0][1] : null;
        $topLevel = substr($current, 0, $firstTable);
        $missing = '';

        foreach ($settings as $name => $value) {
            if (preg_match('/^'.preg_quote($name, '/').'\s*=/m', $topLevel) !== 1) {
                $missing .= sprintf("%s = %s\n", $name, $value);
            }
        }

        return $missing.$current;
    }

    /**
     * @param  list<string>  $tables
     */
    private function withTables(string $current, array $tables): string
    {
        $prepared = $current;

        foreach ($tables as $table) {
            $header = explode("\n", trim($table))[0];

            if (str_contains($prepared, $header)) {
                continue;
            }

            $separator = match (true) {
                $prepared === '' => '',
                str_ends_with($prepared, "\n") => "\n",
                default => "\n\n",
            };
            $prepared .= $separator.trim($table)."\n";
        }

        return $prepared;
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
