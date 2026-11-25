<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Files\Files;
use App\Contracts\Skills\SkillPublisher as SkillPublisherContract;
use App\Enums\Files\Permissions;
use App\Enums\Files\Place;
use App\Exceptions\FileOutsidePlaces;
use App\Exceptions\FilePathInvalid;
use App\Exceptions\FileUnwritable;
use App\Exceptions\FolderClosed;
use App\Exceptions\LinkLeavesPlace;
use App\Exceptions\SkillPublicationFailed;
use App\Values\Depth;
use App\Values\FilePath;
use App\Values\FolderEntry;

/**
 * Writes skills on the host, and only inside the journal's protected skills root, the host-skills place: staged
 * folders under generations, and per target a symlink the journal created, switched to a complete staged folder by an
 * atomic rename under a short lock. A target that is anything else is someone's own files and is never touched.
 */
final readonly class SkillPublisher implements SkillPublisherContract
{
    /**
     * The deepest a staged publication goes: skills/<key>/SKILL.md for Claude Code.
     */
    private const int STAGED_LEVEL_LIMIT = 3;

    private const string GENERATIONS = 'generations';

    public function __construct(
        private SkillTargets $targets,
        private Files $files,
    ) {}

    public function stage(string $stagingFolder, array $files): void
    {
        $folder = $this->pathOf($stagingFolder);

        foreach ($files as $relative => $bytes) {
            $file = $this->childOf($folder, $relative);

            if ($this->files->exists($file) && $this->files->digest($file) === hash('sha256', $bytes)) {
                continue;
            }

            try {
                $this->files->write($file, $bytes);
            } catch (FileUnwritable $failure) {
                throw SkillPublicationFailed::write("{$file->label()} cannot be written", $failure);
            }
        }
    }

    public function activate(string $target, string $stagingFolder): void
    {
        $active = $this->pathOf($target);
        $folder = $this->pathOf($stagingFolder);
        $lock = $active->parent()->child("{$active->name()}.lock");

        try {
            $this->files->makeFolder($active->parent(), Permissions::Shared);
            $this->files->locked($lock, fn () => $this->switchTo($active, $folder));
        } catch (FileUnwritable $failure) {
            throw SkillPublicationFailed::write("the pointer at {$active->label()} cannot be switched", $failure);
        }
    }

    public function clear(string $stagingFolder, array $files): void
    {
        $folder = $this->pathOf($stagingFolder);

        if ($this->files->isLink($folder) || ! $this->files->isFolder($folder)) {
            return;
        }

        $depth = Depth::levels(self::STAGED_LEVEL_LIMIT);

        foreach ($this->files->list($folder, $depth) as $entry) {
            $this->assertStaged($folder, $entry, $files);
        }

        $this->files->deleteFolder($folder, $depth);
        $generation = $folder->parent();

        if ($generation->parent()->relative === self::GENERATIONS
            && $this->files->list($generation)->isEmpty()) {
            $this->files->deleteFolder($generation, Depth::one());
        }
    }

    public function activeFolder(string $target): string|null
    {
        $active = $this->pathOf($target);

        if (! $this->files->isLink($active)) {
            return null;
        }

        return rtrim($this->targets->root(), '/').'/'.$this->files->linkTarget($active)->relative;
    }

    /**
     * Points the active link at the staged folder by making a new link beside it and moving it over the old one, so
     * a reader sees the old generation or the new, never neither.
     */
    private function switchTo(FilePath $active, FilePath $folder): void
    {
        $this->assertOwned($active);
        $pointer = $active->parent()->child("{$active->name()}.next-".bin2hex(random_bytes(6)));

        try {
            $this->files->link($pointer, $folder);
            $this->files->move($pointer, $active);
        } catch (FileUnwritable|LinkLeavesPlace $failure) {
            $this->files->delete($pointer);

            throw SkillPublicationFailed::write("the pointer at {$active->label()} cannot be switched", $failure);
        }
    }

    /**
     * Refuses a target that exists and is not a link into the generations, which only the journal makes.
     */
    private function assertOwned(FilePath $target): void
    {
        if (! $this->files->isLink($target) && ! $this->files->exists($target) && ! $this->files->isFolder($target)) {
            return;
        }

        if (! $this->files->isLink($target)) {
            throw SkillPublicationFailed::collision($target->label());
        }

        try {
            $points = $this->files->linkTarget($target);
        } catch (LinkLeavesPlace $outside) {
            throw SkillPublicationFailed::collision($target->label(), $outside);
        }

        if (! str_starts_with($points->relative, self::GENERATIONS.'/')) {
            throw SkillPublicationFailed::collision($target->label());
        }
    }

    /**
     * Refuses an entry of a staged folder that the journal did not write there with these bytes: an unknown file, a
     * changed one, or a link.
     *
     * @param  array<string, string>  $files
     */
    private function assertStaged(FilePath $folder, FolderEntry $entry, array $files): void
    {
        $relative = substr($entry->path->relative, strlen($folder->relative) + 1);

        if ($entry->isFolder()) {
            return;
        }

        $isStaged = $entry->isFile()
            && array_key_exists($relative, $files)
            && $this->files->digest($entry->path) === hash('sha256', $files[$relative]);

        if (! $isStaged) {
            throw SkillPublicationFailed::changedFile($entry->path->label());
        }
    }

    /**
     * A path the skill targets name, as a path in the host-skills place; its last name is never followed, so the
     * active link is handled as the link.
     */
    private function pathOf(string $path): FilePath
    {
        try {
            return $this->files->pathIn(Place::HostSkills, dirname($path))->child(basename($path));
        } catch (FileOutsidePlaces|FilePathInvalid|FolderClosed $escape) {
            throw SkillPublicationFailed::escape($path, $escape);
        }
    }

    private function childOf(FilePath $folder, string $relative): FilePath
    {
        if ($relative === '') {
            throw SkillPublicationFailed::escape($relative);
        }

        try {
            return $folder->child($relative);
        } catch (FilePathInvalid $escape) {
            throw SkillPublicationFailed::escape($relative, $escape);
        }
    }
}
