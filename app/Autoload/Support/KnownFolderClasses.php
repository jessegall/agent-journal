<?php

declare(strict_types=1);

namespace App\Autoload\Support;

use Closure;

/**
 * The classes of each folder this process already found: the files cannot change while it runs, so a boot takes the
 * classes found before instead of resolving and reflecting on the folder's files again.
 */
final class KnownFolderClasses
{
    /**
     * @var array<string, list<class-string>>
     */
    private static array $found = [];

    /**
     * @param  Closure(): list<class-string>  $read
     * @return list<class-string>
     */
    public static function in(string $folders, string $type, Closure $read): array
    {
        return self::$found["{$folders}|{$type}"] ??= $read();
    }
}
