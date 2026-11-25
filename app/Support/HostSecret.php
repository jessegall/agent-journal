<?php

declare(strict_types=1);

namespace App\Support;

use App\Attributes\Rules\OutsideThePlaces;
use App\Enums\Files\PlaceExemption;
use App\Exceptions\HostSecretUnreadable;

/**
 * The host secret the sign-in runner signs its calls with: read from the owner-only file JOURNAL_HOST_SECRET_FILE
 * names, as a contained service is given it, or from JOURNAL_HOST_SECRET, as bin/journal-account sets it on the Mac.
 */
final readonly class HostSecret
{
    /**
     * @throws HostSecretUnreadable
     */
    public static function fromEnvironment(string $file, string $secret): string
    {
        if ($file === '') {
            return $secret;
        }

        if ($secret !== '') {
            throw HostSecretUnreadable::givenTwice();
        }

        return self::fromFile($file);
    }

    /**
     * @throws HostSecretUnreadable
     */
    #[OutsideThePlaces(PlaceExemption::HostSecretFile)]
    private static function fromFile(string $path): string
    {
        if (! is_file($path)) {
            throw HostSecretUnreadable::missing();
        }

        if ((fileperms($path) & 0o077) !== 0) {
            throw HostSecretUnreadable::tooOpen();
        }

        $secret = rtrim((string) file_get_contents($path), "\n");

        if ($secret === '') {
            throw HostSecretUnreadable::empty();
        }

        return $secret;
    }
}
