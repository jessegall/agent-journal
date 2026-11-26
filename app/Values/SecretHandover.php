<?php

declare(strict_types=1);

namespace App\Values;

/**
 * What a sign-in by a secret hands the driver beside its account folder: variables that name no secret and the files
 * it reads on their own descriptors.
 */
final readonly class SecretHandover
{
    /**
     * @param  array<string, string>  $variables
     * @param  array<int, string>  $readFiles
     */
    public function __construct(public array $variables, public array $readFiles) {}

    public static function none(): self
    {
        return new self([], []);
    }
}
