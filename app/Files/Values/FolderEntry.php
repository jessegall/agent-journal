<?php

declare(strict_types=1);

namespace App\Files\Values;

use App\Files\Enums\EntryType;

/**
 * One entry of a listed folder: its path, what it is, and its fingerprint, so a caller need not stat it again. A
 * link's fingerprint is the link's own, never its target's.
 */
final readonly class FolderEntry
{
    public function __construct(public FilePath $path, public EntryType $type, public Fingerprint $fingerprint) {}

    public function name(): string
    {
        return basename($this->path->relative);
    }

    public function isFolder(): bool
    {
        return $this->type === EntryType::Folder;
    }
}
