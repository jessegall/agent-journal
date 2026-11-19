<?php

declare(strict_types=1);

namespace App\Bus\Resolvers;

use App\Bus\Contracts\OperationResolver;
use App\Bus\Exceptions\OperationUnavailable;
use App\Bus\Models\CommandReceipt;
use App\Bus\Support\Operation;

/**
 * The caller's receipts, read through the receipt model's caller scope; a key used for two commands reads the latest.
 */
final readonly class CallerOperations implements OperationResolver
{
    public function operation(string $requestKey): Operation
    {
        $receipt = CommandReceipt::query()->where(
            'contract_major',
            CommandReceipt::CONTRACT_MAJOR,
        )->where('request_key', $requestKey)->latest()->first()
            ?? throw OperationUnavailable::for($requestKey);

        return $receipt->toOperation();
    }
}
