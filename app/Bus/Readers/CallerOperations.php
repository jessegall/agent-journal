<?php

declare(strict_types=1);

namespace App\Bus\Readers;

use App\Bus\Contracts\OperationReader;
use App\Bus\Exceptions\OperationUnavailable;
use App\Bus\Models\CommandReceipt;
use App\Bus\Support\Operation;

/**
 * The caller's receipts, read through the receipt model's session scope.
 */
final readonly class CallerOperations implements OperationReader
{
    public function operation(string $requestKey): Operation
    {
        $receipt = CommandReceipt::query()->where('contract_major', CommandReceipt::CONTRACT_MAJOR)->where('request_key', $requestKey)->first()
            ?? throw OperationUnavailable::for($requestKey);

        return $receipt->toOperation();
    }
}
