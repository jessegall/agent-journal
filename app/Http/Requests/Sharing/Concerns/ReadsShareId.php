<?php

declare(strict_types=1);

namespace App\Http\Requests\Sharing\Concerns;

/**
 * The share a management route names.
 */
trait ReadsShareId
{
    public function shareId(): string
    {
        return (string) $this->route('share');
    }
}
