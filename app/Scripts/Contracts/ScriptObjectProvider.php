<?php

declare(strict_types=1);

namespace App\Scripts\Contracts;

interface ScriptObjectProvider
{
    /**
     * @return list<class-string>
     */
    public function scriptObjects(): array;
}
