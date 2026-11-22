<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Values\SkillEntry;
use App\Values\SkillKey;

/**
 * Reads the checked skill catalogue: every skill with its owner and rendered text.
 */
interface SkillResolver
{
    /**
     * @return list<SkillEntry>
     */
    public function all(): array;

    public function find(SkillKey $key): SkillEntry;
}
