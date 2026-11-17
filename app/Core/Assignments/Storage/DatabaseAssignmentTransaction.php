<?php

declare(strict_types=1);

namespace App\Core\Assignments\Storage;

use App\Core\Assignments\Contracts\AssignmentTransaction;
use App\Core\Assignments\Exceptions\AssignmentRetryExhausted;
use App\Core\Assignments\Exceptions\AssignmentTransactionRequired;
use Closure;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Database\QueryException;

/**
 * The PostgreSQL repeatable-read transaction behind every assignment command and consistent read.
 */
final readonly class DatabaseAssignmentTransaction implements AssignmentTransaction
{
    public const int ATTEMPTS = 3;

    private const array RETRYABLE_STATES = ['40001', '40P01'];

    public function __construct(private ConnectionInterface $database) {}

    public function run(Closure $work): mixed
    {
        if ($this->database->transactionLevel() > 0) {
            $isolation = (string) $this->database->scalar('SHOW transaction_isolation');

            if ($isolation !== 'repeatable read') {
                throw AssignmentTransactionRequired::forIsolation($isolation);
            }

            return $work();
        }

        for ($attempt = 1; ; $attempt++) {
            try {
                return $this->database->transaction(function () use ($work): mixed {
                    $this->database->statement('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ');

                    return $work();
                });
            } catch (QueryException $failure) {
                if (! in_array($failure->getCode(), self::RETRYABLE_STATES, true)) {
                    throw $failure;
                }

                if ($attempt === self::ATTEMPTS) {
                    throw AssignmentRetryExhausted::after(self::ATTEMPTS, $failure);
                }
            }
        }
    }
}
