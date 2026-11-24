<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
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

    private function __construct(public readonly AgentText $reason, Throwable $previous)
    {
        parent::__construct("classification-unavailable: {$reason->text}", previous: $previous);
    }

    public static function storeFailed(Throwable $failure): self
    {
        return new self(AgentText::of('core.shell.rules_unreadable'), $failure);
    }

    public static function conflicting(CommandRuleConflict $conflict): self
    {
        return new self(AgentText::of('core.shell.rules_conflict', ['conflict' => $conflict->reason->text]), $conflict);
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
