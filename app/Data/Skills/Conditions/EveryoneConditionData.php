<?php

declare(strict_types=1);

namespace App\Data\Skills\Conditions;

use App\Support\Conditions\Everyone;

/**
 * The stored condition that matches everyone.
 */
final class EveryoneConditionData extends StoredConditionData
{
    public function __construct(public readonly int $version)
    {
        $this->type = Everyone::TYPE;
    }
}
