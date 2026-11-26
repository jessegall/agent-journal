<?php

declare(strict_types=1);

namespace App\Skills\Data;

use Spatie\LaravelData\Data;

/**
 * One skill as a generation keeps it: its key and owner, the revision of a stored skill (none for a shipped one), and
 * its rendered markdown with that text's digest.
 */
final class GeneratedSkillData extends Data
{
    public function __construct(
        public readonly string $key,
        public readonly string $owner,
        public readonly int|null $revision,
        public readonly string $markdown,
        public readonly string $digest,
    ) {}
}
