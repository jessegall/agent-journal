<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Bus\Exceptions\ExplicitTransactionInCommand;
use Closure;
use Illuminate\Container\Attributes\Scoped;
use Throwable;

/**
 * The command whose transaction is open in this request: its name and isolation, whether a command is running, and
 * which joined command failed, if one did. Scoped, so a worker serving the next request starts with none.
 */
#[Scoped]
final class RunningCommand
{
    private string|null $command = null;

    private string|null $isolation = null;

    private string|null $failedJoinedCommand = null;

    /**
     * Runs the outermost command's steps with this command marked as running, and clears the mark however it ends.
     *
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    public function running(CommandCall $call, string $isolation, Closure $work): mixed
    {
        $this->command = $call->name();
        $this->isolation = $isolation;
        $this->failedJoinedCommand = null;

        try {
            return $work();
        } finally {
            $this->command = null;
            $this->isolation = null;
        }
    }

    /**
     * Runs a joined command's steps and remembers its failure, so the outer command cannot carry on past it.
     *
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    public function joined(CommandCall $call, Closure $work): mixed
    {
        try {
            return $work();
        } catch (Throwable $failure) {
            $this->failedJoinedCommand ??= $call->name();

            throw $failure;
        }
    }

    public function isRunning(): bool
    {
        return $this->command !== null;
    }

    public function name(): string|null
    {
        return $this->command;
    }

    public function isolation(): string|null
    {
        return $this->isolation;
    }

    public function failedJoinedCommand(): string|null
    {
        return $this->failedJoinedCommand;
    }

    /**
     * Called before any transaction begins: while a command runs, the bus owns the transaction and none other opens.
     */
    public function assertNoExplicitTransaction(): void
    {
        if ($this->command !== null) {
            throw ExplicitTransactionInCommand::for($this->command);
        }
    }
}
