<?php

declare(strict_types=1);

namespace App\Http\Requests\Concerns;

/**
 * A request whose text fields may be left out: each is read once, and a field left out or sent empty is none.
 */
trait ReadsOptionalText
{
    private function optionalText(string $key): string|null
    {
        $text = $this->string($key)->toString();

        if ($text === '') {
            return null;
        }

        return $text;
    }
}
