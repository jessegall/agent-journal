<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\Engine\ReportLineType;

/**
 * One line a console command prints.
 */
final readonly class ReportLine
{
    public function __construct(public ReportLineType $type, public string $text) {}
}
