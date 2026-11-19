<?php

declare(strict_types=1);

namespace App\Bus\Contracts;

use App\Bus\Exceptions\OperationUnavailable;
use App\Bus\Support\Operation;

/**
 * The caller's receipted writes, read by their request key: an agent's of its session.
 */
interface OperationResolver
{
    /**
     * @throws OperationUnavailable when the caller has no write under the key
     */
    public function operation(string $requestKey): Operation;
}
