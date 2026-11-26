<?php

declare(strict_types=1);

namespace App\Processes\Exceptions;

use App\Actors\Contracts\AgentTexts;
use App\Bus\Contracts\CommandRefusal;
use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use App\Time\Values\TimingVerdict;
use App\Values\AgentText;
use RuntimeException;

/**
 * A test or check was refused before anything started because the caller's plan phase is not written yet.
 */
final class PhaseTimingRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function by(TimingVerdict $verdict, AgentTexts $texts): self
    {
        $notice = $texts->render(AgentText::of('core.shell.nothing_started'));

        return new self("phase-timing: {$texts->render($verdict->reason())} {$notice}");
    }

    protected function status(): int
    {
        return 409;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::StateBlocked;
    }
}
