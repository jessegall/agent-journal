<?php

declare(strict_types=1);

namespace App\AgentRequests\Values;

use App\AgentRequests\Enums\ReportLineType;

/**
 * One line a console command prints.
 */
final readonly class ReportLine
{
    public function __construct(public ReportLineType $type, public string $text) {}
}
