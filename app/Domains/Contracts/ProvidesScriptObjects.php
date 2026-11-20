<?php

declare(strict_types=1);

namespace App\Domains\Contracts;

interface ProvidesScriptObjects
{
    /** @return list<class-string> */
    public function scriptObjects(): array;
}
