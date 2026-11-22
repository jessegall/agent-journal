<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Where agents run: on the machine itself (the default), or each in a container of a separate Docker daemon on a
 * server (doc 61, decision 1).
 */
enum ArrangementType: string
{
    case Local = 'local';
    case Contained = 'contained';

    public function isContained(): bool
    {
        return $this === self::Contained;
    }
}
