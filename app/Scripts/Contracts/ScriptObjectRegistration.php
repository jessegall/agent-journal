<?php

declare(strict_types=1);

namespace App\Scripts\Contracts;

/**
 * Registers a domain's script objects under their owner.
 */
interface ScriptObjectRegistration
{
    /**
     * @param  class-string  $class
     */
    public function registerOwned(string $owner, string $class): void;
}
