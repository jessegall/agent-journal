<?php

declare(strict_types=1);

namespace App\Actors\Values;

use App\Actors\Contracts\AuthoritySource;

/**
 * The authority of one named trusted entry of the journal itself, such as the engine pass or a host enrolment.
 */
final readonly class TrustedEntryAuthority implements AuthoritySource
{
    public function __construct(public string $entry) {}

    public function description(): string
    {
        return "the trusted entry {$this->entry}";
    }
}
