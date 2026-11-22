<?php

declare(strict_types=1);

namespace App\Attributes;

use Attribute;

/**
 * Marks a method that decodes JSON whose keys are not ours to name, such as a value of any JSON type kept as stored
 * or a tool's own JSON line, so no Data class can hold it; JsonIntoDataTest allows it only on the methods it lists.
 */
#[Attribute(Attribute::TARGET_METHOD)]
final readonly class DecodesAnyJson {}
