<?php

declare(strict_types=1);

namespace App\Processes\Values\Run;

use App\Processes\Enums\ReportLineType;

/**
 * One line the run command prints.
 */
final readonly class ReportLine
{
    public function __construct(public ReportLineType $type, public string $text) {}
}
