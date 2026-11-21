<?php

declare(strict_types=1);

namespace App\Settings\Attributes;

use Attribute;

/**
 * Marks a method that decodes JSON with no fixed shape, a value of any JSON type kept as it was stored, so no Data
 * class can hold it; JsonIntoDataTest allows it only on the methods it lists.
 */
#[Attribute(Attribute::TARGET_METHOD)]
final readonly class DecodesAnyJson {}
