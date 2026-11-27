<?php

declare(strict_types=1);

namespace App\Support;

/**
 * Files as one POSIX tar archive in memory, each a regular file readable by every user, for a helper that unpacks
 * them where a container reads them.
 */
final readonly class TarArchive
{
    private const int BLOCK = 512;

    /**
     * @param  array<string, string>  $files  each file's content by its name inside the archive
     */
    public static function of(array $files): string
    {
        $archive = '';

        foreach ($files as $name => $content) {
            $archive .= self::header((string) $name, strlen($content)).self::padded($content);
        }

        return $archive.str_repeat("\0", self::BLOCK * 2);
    }

    private static function header(string $name, int $size): string
    {
        $fields = str_pad($name, 100, "\0")
            .sprintf('%07o', 0o644)."\0"
            .sprintf('%07o', 0)."\0"
            .sprintf('%07o', 0)."\0"
            .sprintf('%011o', $size)."\0"
            .sprintf('%011o', 0)."\0";
        $rest = '0'.str_repeat("\0", 100).'ustar'."\0".'00'.str_repeat("\0", 247);
        $unsummed = $fields.str_repeat(' ', 8).$rest;
        $checksum = array_sum(array_map(ord(...), str_split($unsummed)));

        return $fields.sprintf('%06o', $checksum)."\0 ".$rest;
    }

    private static function padded(string $content): string
    {
        $remainder = strlen($content) % self::BLOCK;

        return $remainder === 0 ? $content : $content.str_repeat("\0", self::BLOCK - $remainder);
    }
}
