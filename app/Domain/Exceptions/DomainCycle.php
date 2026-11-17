<?php

declare(strict_types=1);

namespace App\Domain\Exceptions;

final class DomainCycle extends DomainDeclarationError
{
    /**
     * @param  list<string>  $names
     */
    public static function for(array $names): self
    {
        return new self(sprintf(
            'Domains require each other: %s. Let one side listen to the other events instead.',
            implode(', ', $names),
        ));
    }
}
