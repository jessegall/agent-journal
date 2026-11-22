<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\HostOperatorAccess;

/**
 * The words of a refused start's next step for whoever reads it: an actor who operates the hosts reads the operator's
 * instruction, every other member reads it as a request to ask their host operator.
 */
final readonly class StartRemedyWords
{
    public function __construct(private HostOperatorAccess $operators) {}

    public function textOf(StartRemedy $remedy): string
    {
        return $this->operators->isGranted() ? $remedy->operatorText() : $remedy->memberText();
    }
}
