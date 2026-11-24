<?php

declare(strict_types=1);

namespace App\Support\Execution;

use App\Enums\ExitStatus;
use App\Enums\PartEndType;
use App\Values\PartEnd;

/**
 * The status a step ended with, which the next branch decides on: one the journal decides itself, or the exit code a
 * command chose, or 128 plus the signal that ended it.
 */
final readonly class StepStatus
{
    /**
     * The number a shell gives a part ended by a signal: this plus the signal's number.
     */
    private const int SIGNAL_BASE = 128;

    private function __construct(public int $code) {}

    public static function of(ExitStatus $status): self
    {
        return new self($status->value);
    }

    /**
     * The status of an ended part; a part whose end is not known counts as failed.
     */
    public static function ofEnd(PartEnd $end): self
    {
        return match ($end->type) {
            PartEndType::Exited => new self($end->code),
            PartEndType::Signalled => new self(self::SIGNAL_BASE + $end->code),
            PartEndType::NotYet, PartEndType::Unavailable => self::of(ExitStatus::Failure),
        };
    }

    /**
     * A pipeline's status from its commands' statuses in order: the last command's, or with pipefail the last failed
     * command's when one failed.
     *
     * @param  list<self>  $statuses
     */
    public static function ofPipeline(array $statuses, bool $isPipefail): self
    {
        $failed = array_values(array_filter($statuses, fn (self $status) => ! $status->isSuccess()));
        $counted = $isPipefail ? $failed : $statuses;

        if ($counted === []) {
            return self::of(ExitStatus::Success);
        }

        return $counted[array_key_last($counted)];
    }

    public function isSuccess(): bool
    {
        return $this->code === ExitStatus::Success->value;
    }

    /**
     * The status as ! reports it: success becomes failure and every failure success.
     */
    public function negated(): self
    {
        return self::of($this->isSuccess() ? ExitStatus::Failure : ExitStatus::Success);
    }
}
