<?php

declare(strict_types=1);

namespace App\Hooks\Relay;

use App\Hooks\Exceptions\OutputGrantsInvalid;

/**
 * The exact saved outputs one start may read, as the journal sealed them for its start key and mapping generation: the
 * relay reads its own history with the journal away and still refuses every other file of the account. A path counts
 * by its real path, so a link never reaches past a grant, and a folder is never granted, only files.
 */
final readonly class OutputGrants
{
    /**
     * @param  list<string>  $paths
     */
    private function __construct(public int $generation, public array $paths) {}

    /**
     * No grant at all, as when the host handed the start no snapshot.
     */
    public static function none(): self
    {
        return new self(0, []);
    }

    /**
     * The snapshot the host wrote for the start, refused when it is malformed or was not sealed for this start.
     *
     * @throws OutputGrantsInvalid
     */
    public static function fromSnapshot(string $snapshot, string $startKey, OutputGrantSeal $seal): self
    {
        $decoded = json_decode($snapshot, true);

        if (! is_array($decoded) || ! is_int($decoded['generation'] ?? null) || ! is_array($decoded['paths'] ?? null)
            || ! is_string($decoded['seal'] ?? null)) {
            throw OutputGrantsInvalid::malformed();
        }

        $paths = array_values(array_filter($decoded['paths'], is_string(...)));
        $seal->verify($startKey, $decoded['generation'], $paths, $decoded['seal']);

        return new self($decoded['generation'], $paths);
    }

    public function allowsRead(string $path): bool
    {
        $real = realpath($path);

        return $real !== false && is_file($real) && in_array($real, $this->paths, true);
    }
}
