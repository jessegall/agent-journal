<?php

declare(strict_types=1);

namespace App\Skills\Contracts;

use App\Skills\Values\SkillEntry;
use App\Skills\Values\SkillKey;

/**
 * Reads the checked skill catalogue: every skill with its owner and rendered text.
 */
interface SkillReader
{
    /**
     * @return list<SkillEntry>
     */
    public function all(): array;

    public function find(SkillKey $key): SkillEntry;
}
