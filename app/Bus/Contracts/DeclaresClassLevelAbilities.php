<?php

declare(strict_types=1);

namespace App\Bus\Contracts;

/**
 * A policy's ability enum that names which of its abilities apply to a model class rather than to one model, such as
 * Create or ViewAny; only those may pair with a command whose subject is a class.
 */
interface DeclaresClassLevelAbilities
{
    public function isClassLevel(): bool;
}
