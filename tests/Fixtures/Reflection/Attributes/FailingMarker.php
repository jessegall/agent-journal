<?php

declare(strict_types=1);

namespace Tests\Fixtures\Reflection\Attributes;

use Attribute;
use LogicException;
use RuntimeException;

/**
 * An attribute whose constructor always throws.
 */
#[Attribute(Attribute::TARGET_CLASS)]
final class FailingMarker
{
    public const string MESSAGE = 'The marker refuses to be built.';

    public const string CAUSE = 'the cause';

    public function __construct()
    {
        throw new RuntimeException(self::MESSAGE, previous: new LogicException(self::CAUSE));
    }
}
