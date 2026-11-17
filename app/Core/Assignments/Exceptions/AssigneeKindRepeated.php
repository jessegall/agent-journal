<?php

declare(strict_types=1);

namespace App\Core\Assignments\Exceptions;

use App\Core\Actors\Enums\ActorKind;
use LogicException;

final class AssigneeKindRepeated extends LogicException
{
    public static function for(ActorKind $kind): self
    {
        return new self("The actor kind {$kind->value} is declared able to hold records twice; one owner answers for it.");
    }
}
