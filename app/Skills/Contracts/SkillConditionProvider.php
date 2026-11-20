<?php

declare(strict_types=1);

namespace App\Skills\Contracts;

use App\Skills\Values\SkillConditionRegistration;

/**
 * A domain or module that supplies named condition types, such as plans.active-plan, for skills to use.
 */
interface SkillConditionProvider
{
    /**
     * @return list<SkillConditionRegistration>
     */
    public function skillConditions(): array;
}
