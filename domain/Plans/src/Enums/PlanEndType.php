<?php

declare(strict_types=1);

namespace Domain\Plans\Enums;

use Domain\Plans\Commands\CancelPlan\CancelPlanCommand;
use Domain\Plans\Commands\FinishPlan\FinishPlanCommand;

/**
 * How a signed agent call ends a plan: finished with a note, or cancelled with a reason.
 */
enum PlanEndType: string
{
    case Finish = 'finish';
    case Cancel = 'cancel';

    /**
     * The request field that carries the closing text.
     */
    public function textField(): string
    {
        return match ($this) {
            self::Finish => 'note',
            self::Cancel => 'reason',
        };
    }

    public function command(string $planId, int $expectedRevision, string $text): CancelPlanCommand|FinishPlanCommand
    {
        return match ($this) {
            self::Finish => new FinishPlanCommand($planId, $expectedRevision, $text),
            self::Cancel => new CancelPlanCommand($planId, $expectedRevision, $text),
        };
    }
}
