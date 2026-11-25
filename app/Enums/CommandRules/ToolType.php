<?php

declare(strict_types=1);

namespace App\Enums\CommandRules;

/**
 * The tool a verification or build declaration is for; it selects the tool's own contract.
 */
enum ToolType: string
{
    case Pest = 'pest';
    case PhpUnit = 'phpunit';
    case Phpstan = 'phpstan';
    case PintCheck = 'pint_check';
    case PintFix = 'pint_fix';
    case CommandmentsJudge = 'commandments_judge';
    case VueTsc = 'vue_tsc';
    case Tsc = 'tsc';
    case ViteBuild = 'vite_build';
    case Other = 'other';
}
