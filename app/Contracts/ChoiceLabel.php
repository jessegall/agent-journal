<?php

declare(strict_types=1);

namespace App\Contracts;

/**
 * An enum that names each of its cases for people, used as the option labels of an enum setting.
 */
interface ChoiceLabel
{
    public function label(): string;
}
