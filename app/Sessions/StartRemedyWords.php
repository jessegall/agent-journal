<?php

declare(strict_types=1);

namespace App\Sessions;

use App\Hosts\Contracts\HostOperatorAccess;

/**
 * The words of a refused start's next step for whoever reads it: an actor who operates the hosts reads the operator's
 * instruction, every other member reads it as a request to ask their host operator.
 */
final readonly class StartRemedyWords
{
    public function __construct(private HostOperatorAccess $operators) {}

    public function textOf(StartRemedy $remedy): string
    {
        if ($this->operators->isGranted()) {
            return $remedy->operatorText();
        }

        return $remedy->memberText();
    }
}
