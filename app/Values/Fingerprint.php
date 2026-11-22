<?php

declare(strict_types=1);

namespace App\Values;

use App\Exceptions\FileMissing;
use SensitiveParameter;

/**
 * What one stat says of a file: its real path, inode, size, modified time and changed time. Kept bytes are served
 * only while the file's fingerprint stays the same.
 */
final readonly class Fingerprint
{
    private function __construct(
        public string $realPath,
        public int $inode,
        public int $size,
        public int $modifiedAt,
        public int $changedAt,
    ) {}

    /**
     * The fingerprint of the file at a resolved real path, read with one stat.
     */
    public static function of(FilePath $file, #[SensitiveParameter] string $realPath): self
    {
        clearstatcache(true, $realPath);
        $stat = @stat($realPath);

        if ($stat === false) {
            throw FileMissing::at($file->label());
        }

        return new self($realPath, $stat['ino'], $stat['size'], $stat['mtime'], $stat['ctime']);
    }

    /**
     * The fingerprint of a link itself, read with one lstat, never following it.
     */
    public static function ofLink(FilePath $link, #[SensitiveParameter] string $path): self
    {
        clearstatcache(true, $path);
        $stat = @lstat($path);

        if ($stat === false) {
            throw FileMissing::at($link->label());
        }

        return new self($path, $stat['ino'], $stat['size'], $stat['mtime'], $stat['ctime']);
    }

    public function key(): string
    {
        return "{$this->realPath}|{$this->inode}|{$this->size}|{$this->modifiedAt}|{$this->changedAt}";
    }

    /**
     * Whether the file was last changed at least one whole second before now: a file changed within that second may
     * change again at the same size and time unseen, so it is never kept.
     */
    public function isSettled(int $now): bool
    {
        return $this->modifiedAt < $now - 1 && $this->changedAt < $now - 1;
    }
}
