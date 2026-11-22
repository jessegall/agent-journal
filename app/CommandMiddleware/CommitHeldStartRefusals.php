<?php

declare(strict_types=1);

namespace App\CommandMiddleware;

use App\Contracts\Bus\CommandMiddleware;
use App\Support\CommandCall;
use App\Support\CommandNesting;
use App\Support\HeldStartRefusals;
use Closure;
use Illuminate\Database\DatabaseManager;
use Throwable;

/**
 * Around the outermost command's transaction: once it has rolled back, the refusals of the starts it ran inside it
 * are kept on their records, so a replay of their request ids answers with the receipt.
 */
final readonly class CommitHeldStartRefusals implements CommandMiddleware
{
    public function __construct(
        private DatabaseManager $databases,
        private CommandNesting $nesting,
        private HeldStartRefusals $heldRefusals,
    ) {}

    public function handle(CommandCall $call, Closure $next): mixed
    {
        if ($this->nesting->isNested()) {
            return $next($call);
        }

        try {
            return $next($call);
        } catch (Throwable $failure) {
            if ($this->databases->connection()->transactionLevel() === 0) {
                $this->heldRefusals->keep();
            }

            throw $failure;
        } finally {
            $this->heldRefusals->forget();
        }
    }
}
