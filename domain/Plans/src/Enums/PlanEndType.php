<?php

declare(strict_types=1);

namespace Domain\Plans\Enums;

use Domain\Plans\Commands\CancelPlan;
use Domain\Plans\Commands\FinishPlan;

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

    public function command(string $planId, int $expectedRevision, string $text): CancelPlan|FinishPlan
    {
        return match ($this) {
            self::Finish => new FinishPlan($planId, $expectedRevision, $text),
            self::Cancel => new CancelPlan($planId, $expectedRevision, $text),
        };
    }
}
