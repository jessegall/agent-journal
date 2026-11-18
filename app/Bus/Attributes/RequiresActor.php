<?php

declare(strict_types=1);

namespace App\Bus\Attributes;

use App\Actors\Enums\ActorType;
use Attribute;

/**
 * Only an actor of this type may run the command.
 */
#[Attribute(Attribute::TARGET_CLASS)]
final readonly class RequiresActor
{
    public function __construct(public ActorType $type) {}
}
