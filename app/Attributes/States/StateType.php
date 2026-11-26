<?php

declare(strict_types=1);

namespace App\Attributes\States;

use Attribute;

/**
 * A state's own type: the key its frames are saved under and the version of the values it saves, which the builder
 * reads before the state exists.
 */
#[Attribute(Attribute::TARGET_CLASS)]
final readonly class StateType
{
    public function __construct(public string $key, public int $schemaVersion) {}
}
