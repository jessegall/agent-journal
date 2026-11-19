<?php

declare(strict_types=1);

namespace App\Numbers\Contracts;

use App\Numbers\Support\NumberedModel;

/**
 * Where the owners of numbered models declare them while the application boots; the declarations are checked once
 * every owner has booted.
 */
interface NumberedModelRegistration
{
    public function register(NumberedModel ...$models): void;
}
