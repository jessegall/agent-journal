<?php

declare(strict_types=1);

namespace App\Values;

/**
 * The bytes of a file kept for repeated reads, with the fingerprint they were read under and, once a read asked for
 * it, the decoded JSON.
 */
final readonly class KeptFile
{
    /**
     * @param  array<array-key, mixed>|null  $decoded
     */
    public function __construct(public Fingerprint $fingerprint, public string $bytes, public array|null $decoded) {}

    public function size(): int
    {
        return strlen($this->bytes);
    }
}
