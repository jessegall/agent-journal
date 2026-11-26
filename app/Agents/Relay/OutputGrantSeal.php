<?php

declare(strict_types=1);

namespace App\Agents\Relay;

use App\Agents\Relay\Exceptions\OutputGrantsInvalid;
use Illuminate\Container\Attributes\Config;

/**
 * The journal's seal over a start's output grants: it binds the exact paths to the start key and the mapping
 * generation with the application key, so a snapshot edited by hand, copied to another start or kept past a newer
 * mapping is refused.
 */
final readonly class OutputGrantSeal
{
    public function __construct(
        #[Config('app.key')]
        private string $key,
    ) {}

    /**
     * @param  list<string>  $paths
     */
    public function seal(string $startKey, int $generation, array $paths): string
    {
        $sorted = $paths;
        sort($sorted);

        return hash_hmac('sha256', implode("\n", [$startKey, $generation, ...$sorted]), $this->key);
    }

    /**
     * @param  list<string>  $paths
     *
     * @throws OutputGrantsInvalid
     */
    public function verify(string $startKey, int $generation, array $paths, string $seal): void
    {
        if (! hash_equals($this->seal($startKey, $generation, $paths), $seal)) {
            throw OutputGrantsInvalid::unsealed();
        }
    }
}
