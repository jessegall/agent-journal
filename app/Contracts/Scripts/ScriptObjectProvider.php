<?php

declare(strict_types=1);

namespace App\Contracts\Scripts;

interface ScriptObjectProvider
{
    /**
     * @return list<class-string>
     */
    public function scriptObjects(): array;
}
