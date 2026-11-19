<?php

declare(strict_types=1);

namespace App\Hooks\Programs;

use App\Hooks\Exceptions\FolderTrustRefused;

/**
 * The trust Codex needs to run the journal's hooks in a thread: the exact path of an empty working root the journal
 * made, never an agent's work folder and never a parent folder, since a trusted folder's own .codex settings load.
 */
final readonly class CodexFolderTrust
{
    private function __construct(public string $folder) {}

    /**
     * The trust of one of the journal's working roots: a folder directly inside the working roots folder, by its
     * exact path, holding nothing an agent could have written.
     *
     * @throws FolderTrustRefused
     */
    public static function forWorkingRoot(string $workingRoots, string $folder): self
    {
        $isDirectChild = dirname($folder) === rtrim($workingRoots, '/')
            && ! in_array(basename($folder), ['.', '..'], true);

        if (! $isDirectChild || ! is_dir($folder) || is_link($folder)) {
            throw FolderTrustRefused::outsideWorkingRoots($folder);
        }

        if (array_diff(scandir($folder) ?: [], ['.', '..']) !== []) {
            throw FolderTrustRefused::notEmpty($folder);
        }

        return new self($folder);
    }

    /**
     * The configuration table that trusts the folder, as Codex reads it from the account's config.toml.
     */
    public function tomlTable(): string
    {
        $path = addcslashes($this->folder, '"\\');

        return "[projects.\"{$path}\"]\ntrust_level = \"trusted\"\n";
    }

    public function isIn(string $configuration): bool
    {
        return str_contains($configuration, explode("\n", $this->tomlTable())[0]);
    }
}
