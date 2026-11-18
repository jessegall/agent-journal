<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

use App\Hooks\Exceptions\StateTypeRepeated;
use App\Hooks\Exceptions\StateTypesFrozen;

/**
 * Where a domain registers its own state types, while the state types are built once per worker.
 */
interface StateRegistration
{
    /**
     * @throws StateTypeRepeated when the key is registered already
     * @throws StateTypesFrozen when the state types were built already
     */
    public function register(string $typeKey, StateLoader $type): void;
}
