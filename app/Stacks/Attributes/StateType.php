<?php

declare(strict_types=1);

namespace App\Stacks\Attributes;

use App\Stacks\Decisions\StateReferenceFactory;
use App\Stacks\Decisions\StateReferenceKeys;
use Attribute;

/**
 * A state's own type, named by its reference class: the key its frames are saved under and the version of the values
 * it saves, which the builder reads before the state exists.
 */
#[Attribute(Attribute::TARGET_CLASS)]
final readonly class StateType
{
    /**
     * @param  class-string<StateReferenceFactory>  $reference
     */
    public function __construct(public string $reference, public int $version) {}

    public function key(): string
    {
        return StateReferenceKeys::of($this->reference);
    }
}
