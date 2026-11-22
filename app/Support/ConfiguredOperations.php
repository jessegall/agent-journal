<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\OperationNames;
use Illuminate\Container\Attributes\Config;

/**
 * The operation names the installation declares in its trusted config/operations.php, outside any proposal.
 */
final readonly class ConfiguredOperations implements OperationNames
{
    /**
     * @param  list<string>  $operations
     */
    public function __construct(
        #[Config('operations.names', [])]
        private array $operations,
    ) {}

    public function has(string $operation): bool
    {
        return in_array($operation, $this->operations, true);
    }
}
