<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Values\CommandRule;

/**
 * A domain or module that declares how its own programs behave. Its rules wait for review before they classify.
 */
interface CommandRuleProvider
{
    /**
     * @return list<CommandRule>
     */
    public function commandRules(): array;
}
