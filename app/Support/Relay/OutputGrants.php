<?php

declare(strict_types=1);

namespace App\Support\Relay;

use App\Attributes\Rules\OutsideThePlaces;
use App\Enums\Files\PlaceExemption;
use App\Exceptions\OutputGrantsInvalid;
use JsonException;
use Spatie\LaravelData\Exceptions\CannotCreateData;
use TypeError;

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
        try {
            $grants = OutputGrantSnapshot::from(json_decode($snapshot, true, 512, JSON_THROW_ON_ERROR));
        } catch (JsonException|CannotCreateData|TypeError $malformed) {
            throw OutputGrantsInvalid::malformed($malformed);
        }

        $paths = $grants->textPaths();
        $seal->verify($startKey, $grants->generation, $paths, $grants->seal);

        return new self($grants->generation, $paths);
    }

    #[OutsideThePlaces(PlaceExemption::CommandFileSystem)]
    public function allowsRead(string $path): bool
    {
        $real = realpath($path);

        return $real !== false && is_file($real) && in_array($real, $this->paths, true);
    }
}
