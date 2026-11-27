<?php

declare(strict_types=1);

namespace App\Profiles;

use App\Access\Contracts\OperationNames as OperationNamesContract;
use Illuminate\Container\Attributes\Config;

/**
 * The operation names the installation declares in its trusted config/journal.php (operations), outside any proposal.
 */
final readonly class OperationNames implements OperationNamesContract
{
    /**
     * @param  list<string>  $operations
     */
    public function __construct(
        #[Config('journal.operations.names', [])]
        private array $operations,
    ) {}

    public function has(string $operation): bool
    {
        return in_array($operation, $this->operations, true);
    }
}
