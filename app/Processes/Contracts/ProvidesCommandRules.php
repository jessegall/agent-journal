<?php

declare(strict_types=1);

namespace App\Processes\Contracts;

use App\Processes\Values\CommandRule;

/**
 * A domain or module that declares how its own programs behave. Its rules wait for review before they classify.
 */
interface ProvidesCommandRules
{
    /**
     * @return list<CommandRule>
     */
    public function commandRules(): array;
}
