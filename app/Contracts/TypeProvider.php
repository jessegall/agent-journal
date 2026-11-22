<?php

declare(strict_types=1);

namespace App\Contracts;

/**
 * A Core page owner that names the data classes and enums its pages own, so their TypeScript types are generated
 * in its own module rather than Core's.
 */
interface TypeProvider
{
    /**
     * @return list<class-string>
     */
    public function types(): array;
}
