<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Contracts\Authorization\OperationResolver;
use App\Exceptions\OperationUnavailable;
use App\Models\CommandReceipt;
use App\Support\Operation;

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
        )->where('request_key', $requestKey)->latest()->firstOr(fn () => throw OperationUnavailable::for($requestKey));

        return $receipt->toOperation();
    }
}
