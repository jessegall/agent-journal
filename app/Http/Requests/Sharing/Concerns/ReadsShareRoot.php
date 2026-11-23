<?php

declare(strict_types=1);

namespace App\Http\Requests\Sharing\Concerns;

use App\Contracts\Records\RecordResolver;
use App\Support\RecordIdentity;
use App\Support\RecordReference;

/**
 * For a sharing request whose route names the root record as users name it, such as doc 12.
 */
trait ReadsShareRoot
{
    public function shareRoot(RecordResolver $records): RecordIdentity
    {
        return $records->identify(RecordReference::parse($this->rootReference()));
    }

    /**
     * The root as it was named, such as doc 12.
     */
    public function rootReference(): string
    {
        return (string) $this->route('reference');
    }
}
