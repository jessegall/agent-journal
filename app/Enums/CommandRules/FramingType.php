<?php

declare(strict_types=1);

namespace App\Enums\CommandRules;

/**
 * How a tool's output is divided into records.
 */
enum FramingType: string
{
    case Lines = 'lines';
    case JsonLines = 'json_lines';
    case Json = 'json';
    case WorkerFramed = 'worker_framed';
}
