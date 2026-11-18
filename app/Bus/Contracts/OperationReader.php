<?php

declare(strict_types=1);

namespace App\Bus\Contracts;

use App\Bus\Exceptions\OperationUnavailable;
use App\Bus\Readers\CallerOperations;
use App\Bus\Support\Operation;
use Illuminate\Container\Attributes\Bind;

/**
 * The calling session's receipted writes, read by their request key.
 */
#[Bind(CallerOperations::class)]
interface OperationReader
{
    /**
     * @throws OperationUnavailable when this session has no write under the key
     */
    public function operation(string $requestKey): Operation;
}
