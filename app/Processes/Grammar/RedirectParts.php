<?php

declare(strict_types=1);

namespace App\Processes\Grammar;

use App\Values\Redirect;

/**
 * A redirect read up to its substitutions: the redirect itself, and the word whose substitutions are read next.
 */
final readonly class RedirectParts
{
    public function __construct(public Redirect $redirect, public UnparsedSubstitutions $substitutions) {}
}
