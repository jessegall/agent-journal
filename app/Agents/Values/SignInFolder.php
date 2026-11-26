<?php

declare(strict_types=1);

namespace App\Agents\Values;

/**
 * The account folder a driver's sign-in status is read for: its path, its real path, as a driver reports the folder
 * after following a symbolic link, and whether it holds the driver's own sign-in file.
 */
final readonly class SignInFolder
{
    public function __construct(public string $path, public string $realPath, public bool $holdsSignIn) {}

    /**
     * A folder known only by the name a host probe ran in: its real path is its path, and it holds a sign-in when it
     * is named at all.
     */
    public static function named(string $path): self
    {
        return new self($path, $path, $path !== '');
    }

    /**
     * Whether a folder a driver reported is this one, by its path behind a trailing slash or not, or its real path.
     */
    public function isReportedAs(string $reported): bool
    {
        return in_array(rtrim($reported, '/'), [rtrim($this->path, '/'), $this->realPath], true);
    }
}
