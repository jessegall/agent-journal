<?php

declare(strict_types=1);

namespace App\Files\Values;

/**
 * The sha256 of a file, with the fingerprint it was hashed under.
 */
final readonly class KeptDigest
{
    public function __construct(public Fingerprint $fingerprint, public string $digest) {}
}
