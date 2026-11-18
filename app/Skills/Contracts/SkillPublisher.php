<?php

declare(strict_types=1);

namespace App\Skills\Contracts;

use App\Skills\Exceptions\SkillPublicationFailed;

/**
 * The only way skills reach the host's files: it stages files in a journal-owned folder, then switches a target's
 * journal-owned pointer to a complete staged folder in one step. Every path stays inside the protected root.
 */
interface SkillPublisher
{
    /**
     * Writes these files into the staging folder; a file already there with the same bytes is left as it is.
     *
     * @param  array<string, string>  $files  bytes by path relative to the staging folder
     *
     * @throws SkillPublicationFailed
     */
    public function stage(string $stagingFolder, array $files): void;

    /**
     * Points the target at the staged folder in one step, under a short lock.
     *
     * @throws SkillPublicationFailed when the target is not the journal's pointer or a path leaves the root
     */
    public function activate(string $target, string $stagingFolder): void;

    /**
     * Removes a staged folder that holds exactly these files with these bytes, or a part of them; a folder with any
     * other or changed file is kept whole. A folder that is not there is already clear.
     *
     * @param  array<string, string>  $files  bytes by path relative to the staging folder
     *
     * @throws SkillPublicationFailed when the folder holds a file the journal did not stage there
     */
    public function clear(string $stagingFolder, array $files): void;

    /**
     * The staged folder the target points at now, or null when the journal has not published there.
     */
    public function activeFolder(string $target): string|null;
}
