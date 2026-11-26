<?php

declare(strict_types=1);

namespace App\Access\Contracts\Events;

/**
 * Where a classification fact comes from: a declared command rule at one revision, or the shell syntax itself.
 */
interface FactOrigin
{
    /**
     * The origin as one short reference, such as rule:git-push@3 or syntax:redirect.
     */
    public function reference(): string;
}
