<?php

declare(strict_types=1);

namespace App\Actors\Contracts;

/**
 * An enum that names each of its cases for users, used as the option labels of an enum setting.
 */
interface ChoiceLabel
{
    /**
     * The words the user sees for this choice.
     */
    public function label(): string;
}
