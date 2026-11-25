<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Actors\AgentTexts;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use App\Values\AgentText;
use RuntimeException;
use Throwable;

/**
 * The project's rules could not be read, so no command can be classified: explain and admission refuse with
 * classification-unavailable, and nothing falls back to rules cached for another project.
 */
final class ClassificationUnavailable extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    private function __construct(public readonly AgentText $reason, AgentTexts $texts, Throwable $previous)
    {
        parent::__construct("classification-unavailable: {$texts->render($reason)}", previous: $previous);
    }

    public static function storeFailed(Throwable $failure, AgentTexts $texts): self
    {
        return new self(AgentText::of('core.shell.rules_unreadable'), $texts, $failure);
    }

    public static function conflicting(CommandRuleConflict $conflict, AgentTexts $texts): self
    {
        return new self(
            AgentText::of('core.shell.rules_conflict', ['conflict' => $conflict->reason]),
            $texts,
            $conflict,
        );
    }

    protected function status(): int
    {
        return 503;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Unavailable;
    }
}
