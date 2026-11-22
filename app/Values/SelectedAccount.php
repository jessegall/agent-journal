<?php

declare(strict_types=1);

namespace App\Values;

use App\Exceptions\AccountFolderInvalid;
use App\Support\RecordIdentity;

/**
 * The account a start of a driver runs with: its record by identity, the sign-in generation it is in and the private
 * folder the driver reads its sign-in from. It never leaves the server and holds no secret itself.
 */
final readonly class SelectedAccount
{
    public function __construct(
        public RecordIdentity $record,
        public string $driver,
        public string $directory,
        public int $generation,
    ) {}

    /**
     * The name of the account's own folder, a plain id the begin handlers made, which a contained start binds from
     * under the accounts root; anything else is refused, so no request can name another path.
     *
     * @throws AccountFolderInvalid
     */
    public function folder(): string
    {
        $name = basename($this->directory);

        if (preg_match('/^[a-z0-9]+$/', $name) !== 1 || str_contains($this->directory, '..')) {
            throw AccountFolderInvalid::named($name);
        }

        return $name;
    }
}
