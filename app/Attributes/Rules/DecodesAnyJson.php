<?php

declare(strict_types=1);

namespace App\Attributes\Rules;

use Attribute;

/**
 * Marks a method that decodes JSON whose keys the journal does not name, such as a stored value of any JSON type or a
 * tool's own JSON line, which no Data class can hold; JsonIntoDataTest allows it only on the methods it lists.
 */
#[Attribute(Attribute::TARGET_METHOD)]
final readonly class DecodesAnyJson {}
