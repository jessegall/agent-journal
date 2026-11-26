<?php

declare(strict_types=1);

namespace App\Records\Values;

/**
 * The declared page that opens a record, by its full name and the one argument it takes, such as plans.plan with plan
 * 12; it is offered only to a viewer who may open it.
 */
final readonly class SummaryPage
{
    public function __construct(public string $page, public string $argument, public string $value) {}
}
