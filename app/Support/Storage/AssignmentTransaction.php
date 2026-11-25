<?php

declare(strict_types=1);

namespace App\Support\Storage;

use App\Contracts\Assignments\AssignmentTransaction as AssignmentTransactionContract;
use App\Exceptions\AssignmentRetryExhausted;
use App\Exceptions\AssignmentTransactionRequired;
use Closure;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Database\QueryException;

/**
 * The PostgreSQL repeatable-read transaction behind every assignment command and consistent read.
 */
final readonly class AssignmentTransaction implements AssignmentTransactionContract
{
    public const int ATTEMPTS = 3;

    private const array RETRYABLE_STATES = [
        '40001',
        '40P01',
    ];

    public function __construct(private ConnectionInterface $database) {}

    public function assertOpen(): void
    {
        if ($this->database->transactionLevel() === 0) {
            throw AssignmentTransactionRequired::forIsolation('none');
        }

        $isolation = (string) $this->database->scalar('SHOW transaction_isolation');

        if ($isolation !== 'repeatable read') {
            throw AssignmentTransactionRequired::forIsolation($isolation);
        }
    }

    public function run(Closure $work): mixed
    {
        if ($this->database->transactionLevel() > 0) {
            $this->assertOpen();

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
