<?php

declare(strict_types=1);

namespace App\Skills\Data\Conditions;

/**
 * A stored condition that matches by a list of keys, such as grants, profiles, drivers, providers or environments.
 */
final class KeyedConditionData extends StoredConditionData
{
    /**
     * @param  list<string>  $keys
     */
    public function __construct(string $type, public readonly int $version, public readonly array $keys)
    {
        $this->type = $type;
    }
}
