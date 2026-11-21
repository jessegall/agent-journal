<?php

declare(strict_types=1);

namespace App\Processes\Stored;

use App\Processes\Values\ScriptBinding;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * A script binding as it is stored, the shape ScriptBinding::toArray writes: the package file, script and digest.
 *
 * @method static array<int, static> collect(mixed $items) read only from decoded JSON, so always an array
 */
#[MapInputName(SnakeCaseMapper::class)]
final class StoredScriptBinding extends Data
{
    public function __construct(
        public readonly string $packageFile,
        public readonly string $script,
        public readonly string $digest,
    ) {}

    public function binding(): ScriptBinding
    {
        return new ScriptBinding($this->packageFile, $this->script, $this->digest);
    }
}
