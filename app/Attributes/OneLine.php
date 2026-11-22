<?php

declare(strict_types=1);

namespace App\Attributes;

use App\Support\OneLineRule;
use Attribute;
use Spatie\LaravelData\Attributes\Validation\CustomValidationAttribute;
use Spatie\LaravelData\Support\Validation\ValidationPath;

/**
 * Asks that a text be one line: a line break between two words fails, blanks around it pass.
 */
#[Attribute(Attribute::TARGET_PROPERTY | Attribute::TARGET_PARAMETER)]
final class OneLine extends CustomValidationAttribute
{
    public function getRules(ValidationPath $path): object
    {
        return new OneLineRule();
    }
}
