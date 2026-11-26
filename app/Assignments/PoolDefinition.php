<?php

declare(strict_types=1);

namespace App\Assignments;

use App\Assignments\Contracts\AssignmentPoolFactory;

/**
 * A domain's declaration of one pool: its key, the assignable type it holds, the factory that opens it and its label.
 */
final readonly class PoolDefinition
{
    /**
     * @param  string  $factoryClass  a class name, refused unless it is an AssignmentPoolFactory
     */
    public function __construct(
        public string $key,
        public string $assignableType,
        public string $factoryClass,
        public string $label,
    ) {}
}
