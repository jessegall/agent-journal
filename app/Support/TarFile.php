<?php

declare(strict_types=1);

namespace App\Support;

/**
 * One regular file of a tar archive: its name inside the archive, its content, and the user and mode it is unpacked
 * with.
 */
final readonly class TarFile
{
    /**
     * Readable by every user and owned by root, as most files a container only reads.
     */
    private const int SHARED_MODE = 0o644;

    /**
     * Readable by its owner alone.
     */
    private const int PRIVATE_MODE = 0o400;

    private function __construct(public string $name, public string $content, public int $mode, public int $owner) {}

    public static function shared(string $name, string $content): self
    {
        return new self($name, $content, self::SHARED_MODE, 0);
    }

    /**
     * A file only the user with that id may read, such as a key the commands a model runs must never see.
     */
    public static function privateTo(int $owner, string $name, string $content): self
    {
        return new self($name, $content, self::PRIVATE_MODE, $owner);
    }
}
