<?php

declare(strict_types=1);

namespace App\Support\Drivers;

use App\Attributes\Rules\OutsideThePlaces;
use App\Enums\Files\PlaceExemption;
use App\Exceptions\AccountConfigurationUnwritten;

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
    public function addTrust(string $directory, CodexFolderTrust $trust): bool
    {
        return $this->prepare($directory, [], [], $trust, []);
    }

    /**
     * Adds, in one locked write, each top-level setting and each table the file lacks and the root's trust, puts each
     * replaced table in whole, and answers whether it changed the file. A setting or added table already there is
     * left exactly as it is; trust is only ever added.
     *
     * @param  array<string, string>  $settings  top-level keys and their TOML values, such as the file sign-in store
     * @param  list<string>  $tables  whole TOML tables, each known by its header line
     * @param  list<string>  $replacedTables  whole TOML tables that take the place of one with the same header
     *
     * @throws AccountConfigurationUnwritten
     */
    #[OutsideThePlaces(PlaceExemption::HostAccountFolder)]
    public function prepare(
        string $directory,
        array $settings,
        array $tables,
        CodexFolderTrust $trust,
        array $replacedTables,
    ): bool {
        $path = rtrim($directory, '/').'/config.toml';
        $lock = fopen($path.'.lock', 'c');

        if ($lock === false || ! flock($lock, LOCK_EX)) {
            throw AccountConfigurationUnwritten::at($path);
        }

        try {
            $current = is_file($path) ? (string) file_get_contents($path) : '';
            $added = $this->withTables($this->withSettings($current, $settings), [
                ...$tables,
                $trust->tomlTable(),
            ]);
            $prepared = $this->withTables($this->withoutTables($added, $replacedTables), $replacedTables);

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

        foreach ($settings as $name => $setting) {
            if (preg_match('/^'.preg_quote($name, '/').'\s*=/m', $topLevel) !== 1) {
                $missing .= sprintf("%s = %s\n", $name, $setting);
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
     * The configuration without the tables that carry the same header lines, each up to the next table.
     *
     * @param  list<string>  $tables
     */
    private function withoutTables(string $current, array $tables): string
    {
        $prepared = $current;

        foreach ($tables as $table) {
            $header = preg_quote(explode("\n", trim($table))[0], '/');
            $prepared = (string) preg_replace('/^'.$header.'\R(?:(?!\[).*\R?)*/m', '', $prepared);
        }

        return $prepared;
    }

    /**
     * @throws AccountConfigurationUnwritten
     */
    #[OutsideThePlaces(PlaceExemption::HostAccountFolder)]
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
