<?php

declare(strict_types=1);

namespace App\Skills\Values;

use App\Values\SkillKey;

/**
 * A skill rendered to the exact Markdown a driver reads, with the sha256 digest of those bytes.
 */
final readonly class RenderedSkill
{
    public function __construct(
        public SkillKey $key,
        public string $markdown,
        public string $digest,
    ) {}
}
