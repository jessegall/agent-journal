<?php

declare(strict_types=1);

namespace App\Files\Enums;

/**
 * What a folder entry is: a file, a folder, or a link, which a list shows and never follows.
 */
enum EntryType: string
{
    case File = 'file';
    case Folder = 'folder';
    case Link = 'link';

    public static function at(string $path): self
    {
        return match (true) {
            is_link($path) => self::Link,
            is_dir($path) => self::Folder,
            default => self::File,
        };
    }
}
