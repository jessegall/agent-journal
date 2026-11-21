<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Lifecycle;

use App\Bus\Contracts\Command;
use App\Bus\Contracts\GuardedCommandBus;
use App\Bus\Enums\CommandOriginStatus;
use App\Hooks\Lifecycle\LifecycleOrigins;
use Closure;

/**
 * A guarded bus for tests that runs nothing: it records each command with the lifecycle origin in effect and whether
 * a database transaction was still open, after asking the command's guard.
 */
final class RecordingGuardedBus implements GuardedCommandBus
{
    /**
     * @var list<array{command: class-string, stage: string|null, ordinal: int|null, inTransaction: bool}>
     */
    public array $runs = [];

    public function __construct(private readonly LifecycleOrigins $origins, private readonly Closure $transactionLevel) {}

    public function runGuarded(Command $command, Closure $check): CommandOriginStatus
    {
        $status = $check();

        if ($status !== CommandOriginStatus::Eligible) {
            return $status;
        }

        $origin = $this->origins->current();
        $this->runs[] = [
            'command' => $command::class,
            'stage' => $origin->isDefined() ? $origin->get()->stage->value : null,
            'ordinal' => $origin->isDefined() ? $origin->get()->ordinal : null,
            'inTransaction' => ($this->transactionLevel)() > 0,
        ];

        return CommandOriginStatus::Eligible;
    }
}
