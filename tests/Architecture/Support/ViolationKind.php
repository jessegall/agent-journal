<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

/**
 * What a domain did wrong, each case writing its own reason.
 */
enum ViolationKind: string
{
    case UndeclaredDomain = 'undeclared-domain';
    case OutsideEveryDomain = 'outside-every-domain';

    public function reason(Violation $violation): string
    {
        return match ($this) {
            self::UndeclaredDomain => "uses {$violation->used}, but {$violation->usingDomain} does not require {$violation->owner}",
            self::OutsideEveryDomain => "uses {$violation->used}, which is project code outside every domain",
        };
    }
}
